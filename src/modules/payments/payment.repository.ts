import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { Between, FindOptionsWhere, In, MoreThan, Repository } from "typeorm";
import dayjs from "@/utils/dayjs.config";
import { FilterPaymentDto, SortPaymentDto } from "./dto/query-payment.dto";
import { IPaginationOptions } from "utils/types/pagination-options";
import { PaginationResponseDto } from "utils/types/pagination-response.dto";
import { Payment } from "./payment.domain";
import { PaymentMapper } from "./payment.mapper";
import { PayStudentDto } from "./dto/pay-student.dto";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "@/generated/i18n.generated";
import { SessionEntity } from "modules//sessions/entities/session.entity";
import { GetQRDto } from "./dto/get-QR.dto";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "config/config.type";
import { catchError, firstValueFrom, Observable } from "rxjs";
import { ConfirmDto } from "./dto/confirm.dto";
import { PAYMENT_METHOD } from "utils/payments/constant";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectRepository(PaymentEntity) private paymentsRepository: Repository<PaymentEntity>,
        private i18nService: I18nService<I18nTranslations>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService<AllConfigType>,
    ) { }

    async autoUpdatePaymentRecord(session: SessionEntity) {
        const month = dayjs(session.date).month() + 1;
        const year = dayjs(session.date).year();
        const classId = session.class.id
        const paymentEntities = await this.paymentsRepository.find({
            where: { month, year, classId },
            relations: ['class']
        })

        if (paymentEntities.length <= 0) {
            const paymentRecords = [];
            session.attendances.filter(student => {
                let totalLessons = 0;
                let discountPercent = 0;
                let totalAmount = 0;
                if (student.status === 'present' || student.status === 'late') totalLessons++;
                session.class.students.map(item => {
                    if (item.studentId === student.student.id) {
                        discountPercent = item.discountPercent;
                        totalAmount = totalLessons * session.class.feePerLesson
                    }
                })
                if (totalLessons <= 0) return false;
                paymentRecords.push(this.paymentsRepository.create({
                    month,
                    year,
                    totalLessons,
                    totalAmount,
                    discountPercent,
                    studentId: student.studentId.toString(),
                    classId: classId.toString()
                }))
            })
            return await this.paymentsRepository.save(paymentRecords)
        }
        else if (paymentEntities.length > 0) {
            for (const student of session.attendances) {
                paymentEntities.map(item => {
                    if (item.studentId === student.student.id && student.isModified === true) {
                        item.totalLessons =
                            student.status === 'present' || student.status === 'late' ? item.totalLessons + 1 : item.totalLessons;
                        item.totalLessons =
                            student.status === 'absent' && item.totalLessons > 0 ? item.totalLessons - 1 : item.totalLessons;
                    }
                })
            }
            return await this.paymentsRepository.save(paymentEntities)
        }
    }

    async getAllPayments(
        { filterOptions, sortOptions, paginationOptions }
            : { filterOptions: FilterPaymentDto, sortOptions: SortPaymentDto[], paginationOptions: IPaginationOptions })
        : Promise<PaginationResponseDto<Payment>> {
        const where: FindOptionsWhere<PaymentEntity> = {};

        if (filterOptions?.studentId) where.studentId = filterOptions.studentId;

        if (filterOptions?.classId) where.classId = filterOptions.classId;

        if (filterOptions?.status) where.status = filterOptions.status;

        if (filterOptions?.month) where.month = filterOptions.month;

        if (filterOptions?.year) where.year = filterOptions.year;

        if (filterOptions?.startMonth && filterOptions?.endMonth) {
            where.month = Between(filterOptions.startMonth, filterOptions.endMonth);
            where.year = filterOptions.year;
        }

        const [entities, total] = await this.paymentsRepository.findAndCount({
            where: { ...where, totalAmount: MoreThan(0) },
            relations: ['class', 'student.classes'],
            skip: (paginationOptions.page - 1) * paginationOptions.limit || 0,
            take: paginationOptions.limit,
            order: sortOptions.length > 0
                ? sortOptions.reduce((acc, sort) => {
                    acc[sort.orderBy] = sort.order;
                    return acc;
                }, {})
                : { year: 'DESC', month: 'DESC' },
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit) || 1

        return {
            meta: {
                limit: paginationOptions.limit || null,
                page: paginationOptions.page || null,
                totalPages,
                totalItems
            },
            result: entities ? entities.map(item => PaymentMapper.toDomain(item)) : null
        }
    }

    handleProcessPayment(entity: PaymentEntity, payStudentDto: PayStudentDto) {
        if (entity.totalLessons === 0) throw new BadRequestException('No lessons');
        if (entity.status === 'paid') throw new BadRequestException('Fully paid');
        if (entity.paidAmount + +payStudentDto.amount > entity.totalAmount) throw new BadRequestException('Exceeds remaning balance')
        if (Array.isArray(entity.histories)) {
            entity.histories.push({
                amount: payStudentDto.amount,
                method: payStudentDto.method,
                note: payStudentDto.note,
                date: new Date()
            })
        }
    }

    async payStudent(paymentId: Payment['id'], payStudentDto: PayStudentDto) {
        const entity = await this.paymentsRepository.findOne({
            where: { id: paymentId }
        })
        this.handleProcessPayment(entity, payStudentDto);
        await this.paymentsRepository.save(entity)
        return PaymentMapper.toDomain(entity)
    }

    async getQR(getQrDto: GetQRDto): Promise<any> {
        const bank = this.configService.get('payment.bank', { infer: true });
        const acc = this.configService.get('payment.acc', { infer: true });
        const paymentEntity = await this.paymentsRepository.findOne({
            where: { id: getQrDto.paymentId },
            relations: { student: true, class: true }
        })

        const content = `${paymentEntity.student.name} ${paymentEntity.class.name} ${paymentEntity.referenceCode}`

        if (getQrDto && (!getQrDto.amount || getQrDto.amount <= 0)) {
            throw new BadRequestException('Số tiền phải là số nguyên lớn hơn 0')
        }

        const qrUrl = `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${getQrDto.amount}&des=${content}&template=TEMPLATE&download=${getQrDto.download}`;

        const { data } = await firstValueFrom(
            this.httpService.get(qrUrl))
        return data && {
            qrUrl,
            studentName: paymentEntity.student.name,
            class: {
                name: paymentEntity.class.name,
                grade: paymentEntity.class.grade,
                section: paymentEntity.class.section,
                year: paymentEntity.class.year
            }
        }
    }



    async confirmPayment(confirmDto: ConfirmDto, apiKey: string) {
        const splitedContent = confirmDto.content.split(' ');

        const referenceCode = splitedContent.at(splitedContent.length - 1);

        const systemApiKey = this.configService.get('payment.apiKey', { infer: true })

        if (apiKey !== `Apikey ${systemApiKey}`) throw new UnauthorizedException('Please authenticate')

        const payment = await this.paymentsRepository.findOne({
            where: { referenceCode }
        })

        if (confirmDto && confirmDto.transferType === 'in' && confirmDto.transferAmount > 0) {
            this.handleProcessPayment(payment, {
                amount: confirmDto.transferAmount,
                method: PAYMENT_METHOD.BANK_TRANSFER,
                note: confirmDto.content
            })

            await this.paymentsRepository.save(payment);
        }
        return { success: true }
    }
}