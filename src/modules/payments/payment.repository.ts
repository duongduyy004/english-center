import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { Between, FindOptionsWhere, In, Repository } from "typeorm";
import * as dayjs from "dayjs";
import { FilterPaymentDto, SortPaymentDto } from "./dto/query-payment.dto";
import { IPaginationOptions } from "utils/types/pagination-options";
import { PaginationResponseDto } from "utils/types/pagination-response.dto";
import { Payment } from "./payment.domain";
import { PaymentMapper } from "./payment.mapper";
import { PayStudentDto } from "./dto/pay-student.dto";
import { I18nService } from "nestjs-i18n";
import { I18nTranslations } from "@/generated/i18n.generated";
import { SessionEntity } from "modules//sessions/entities/session.entity";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectRepository(PaymentEntity) private paymentsRepository: Repository<PaymentEntity>,
        private i18nService: I18nService<I18nTranslations>
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
            const paymentRecords = session.attendances.map(student => {
                let totalLessons = 0;
                let discountPercent = 0;
                let totalAmount = 0;
                if (student.status === 'present' || student.status === 'late') totalLessons++;
                session.class.students.map(item => {
                    if (item.studentId === student.student.id) {
                        discountPercent = item.discount_percent;
                        totalAmount = totalLessons * session.class.feePerLesson
                    }
                })
                return this.paymentsRepository.create({
                    month,
                    year,
                    totalLessons,
                    totalAmount,
                    discountPercent,
                    studentId: student.studentId.toString(),
                    classId: classId.toString()
                })
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
            await this.paymentsRepository.save(paymentEntities)
        }
        return paymentEntities
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
            where: where,
            relations: ['class', 'student.classes'],
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)

        return {
            meta: {
                limit: paginationOptions.limit,
                page: paginationOptions.page,
                totalPages,
                totalItems
            },
            result: entities ? entities.map(item => PaymentMapper.toDomain(item)) : null
        }
    }

    async payStudent(paymentId: Payment['id'], payStudentDto: PayStudentDto) {
        const entity = await this.paymentsRepository.findOne({
            where: { id: paymentId }
        })
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
            await this.paymentsRepository.save(entity)
        }
        return PaymentMapper.toDomain(entity)
    }
}