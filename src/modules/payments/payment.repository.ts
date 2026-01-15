import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { NotificationsService } from 'modules/notifications/notifications.service';
import { NOTIFICATION_ENUM } from 'modules/notifications/types/notification-type.enum';
import { Between, FindOptionsWhere, MoreThan, Raw, Repository } from 'typeorm';
import dayjs from '@/utils/dayjs.config';
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { Payment } from './payment.domain';
import { PaymentMapper } from './payment.mapper';
import { PayStudentDto } from './dto/pay-student.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { SessionEntity } from 'modules//sessions/entities/session.entity';
import { GetQRDto } from './dto/get-QR.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'config/config.type';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { ConfirmDto } from './dto/confirm.dto';
import { PAYMENT_METHOD } from 'utils/payments/constant';
import { PaymentGateway } from './payment.gateway';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentsRepository: Repository<PaymentEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly notificationsService: NotificationsService,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async autoUpdatePaymentRecord(session: SessionEntity) {
    const month = dayjs(session.date).month() + 1;
    const year = dayjs(session.date).year();
    const classId = session.class.id;
    const paymentEntities = await this.paymentsRepository.find({
      where: { month, year, classId },
      relations: ['class'],
    });

    if (paymentEntities.length <= 0) {
      const paymentRecords = [];
      session.attendances.filter((student) => {
        let totalLessons = 0;
        let discountPercent = 0;
        let totalAmount = 0;
        if (student.status === 'present' || student.status === 'late')
          totalLessons++;
        session.class.students.map((item) => {
          if (item.studentId === student.student.id) {
            discountPercent = item.discountPercent;
            totalAmount = totalLessons * session.class.feePerLesson;
          }
        });
        if (totalLessons <= 0) return false;
        paymentRecords.push(
          this.paymentsRepository.create({
            month,
            year,
            totalLessons,
            totalAmount,
            discountPercent,
            studentId: student.studentId.toString(),
            classId: classId.toString(),
          }),
        );
      });
      return await this.paymentsRepository.save(paymentRecords);
    } else if (paymentEntities.length > 0) {
      for (const student of session.attendances) {
        paymentEntities.map((item) => {
          if (item.studentId === student.student.id) {
            item.totalLessons =
              student.status === 'present' || student.status === 'late'
                ? item.totalLessons + 1
                : item.totalLessons;
            item.totalLessons =
              student.status === 'absent' && item.totalLessons > 0
                ? item.totalLessons - 1
                : item.totalLessons;
          }
        });
      }
      return await this.paymentsRepository.save(paymentEntities);
    }
  }

  async getAllPayments({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterPaymentDto;
    sortOptions: SortPaymentDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Payment>> {
    const where: FindOptionsWhere<PaymentEntity> = {};

    if (filterOptions?.studentId) where.studentId = filterOptions.studentId;

    if (filterOptions?.studentName) {
      const rawName = String(filterOptions.studentName)
        .trim()
        .replace(/^"+|"+$/g, '')
        .replace(/\s+/g, ' ');

      const escaped = rawName
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_');

      where.student = {
        name: Raw((alias) => `${alias} ILIKE :studentName ESCAPE '\\'`, {
          studentName: `%${escaped}%`,
        }),
      };
    }

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
      relations: ['class', 'student'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit || 0,
      take: paginationOptions.limit,
      order:
        sortOptions.length > 0
          ? sortOptions.reduce((acc, sort) => {
              acc[sort.orderBy] = sort.order;
              return acc;
            }, {})
          : { year: 'DESC', month: 'DESC' },
    });

    const allEntities = await this.paymentsRepository.find({
      where: { ...where, totalAmount: MoreThan(0) },
      relations: ['class', 'student'],
    });

    const statistics = {
      totalStudentFees: allEntities.reduce((sum, e) => {
        const totalAmount = e.totalAmount || 0;
        const discountAmount = (totalAmount * (e.discountPercent || 0)) / 100;
        return sum + (totalAmount - discountAmount);
      }, 0),
      totalPaidAmount: allEntities.reduce(
        (sum, e) => sum + (e.paidAmount || 0),
        0,
      ),
      totalRemainingAmount: allEntities.reduce((sum, e) => {
        const totalAmount = e.totalAmount || 0;
        const discountAmount = (totalAmount * (e.discountPercent || 0)) / 100;
        const paidAmount = e.paidAmount || 0;
        return sum + (totalAmount - discountAmount - paidAmount);
      }, 0),
    };

    const totalItems = total;
    const totalPages = Math.ceil(totalItems / paginationOptions.limit) || 1;

    return {
      meta: {
        limit: paginationOptions.limit || null,
        page: paginationOptions.page || null,
        totalPages,
        totalItems,
      },
      result: entities
        ? entities.map((item) => PaymentMapper.toDomain(item))
        : null,
      statistics,
    };
  }

  handleProcessPayment(entity: PaymentEntity, payStudentDto: PayStudentDto) {
    if (!entity) throw new NotFoundException('Payment not found');
    if (!entity.totalLessons || entity.totalLessons <= 0)
      throw new BadRequestException('No lessons');
    if (entity.status === 'paid') throw new BadRequestException('Fully paid');
    if (entity.paidAmount + +payStudentDto.amount > entity.totalAmount)
      throw new BadRequestException('Exceeds remaining balance');
    if (Array.isArray(entity.histories)) {
      entity.histories.push({
        amount: payStudentDto.amount,
        method: payStudentDto.method,
        note: payStudentDto.note,
        date: new Date(),
      });
    }
  }

  async payStudent(paymentId: Payment['id'], payStudentDto: PayStudentDto) {
    const entity = await this.paymentsRepository.findOne({
      where: { id: paymentId },
      relations: ['student', 'student.parent', 'class'],
    });
    this.handleProcessPayment(entity, payStudentDto);
    await this.paymentsRepository.save(entity);

    if (entity?.referenceCode) {
      this.paymentGateway.notifyPaymentSuccess(entity.referenceCode, {
        paymentId: entity.id,
        status: entity.status,
        paidAmount: entity.paidAmount,
        totalAmount: entity.totalAmount,
        discountPercent: entity.discountPercent,
        amount: payStudentDto.amount,
        method: payStudentDto.method,
        note: payStudentDto.note,
        studentName: entity.student?.name,
      });
    }

    // Send PAYMENT_SUCCESS notification
    if (entity.student?.parent?.id) {
      await this.notificationsService.send(
        [
          {
            actorId: null,
            recipientIds: [entity.student.parent.id],
            notificationType: NOTIFICATION_ENUM.PAYMENT_SUCCESS,
            data: {
              id: NOTIFICATION_ENUM.PAYMENT_SUCCESS,
              title: 'Thanh toán thành công',
              entityName: 'payments',
              body: {
                amount: entity.totalAmount,
                paidAmount: entity.paidAmount,
                studentName: entity.student.name,
                className: entity.class.name,
                month: entity.month,
                year: entity.year,
              },
              metadata: { entityId: entity.id },
            },
          },
        ],
        { isOnline: false },
      );
    }

    return PaymentMapper.toDomain(entity);
  }

  async getQR(getQrDto: GetQRDto): Promise<any> {
    const bank = this.configService.get('payment.bank', { infer: true });
    const acc = this.configService.get('payment.acc', { infer: true });
    const paymentEntity = await this.paymentsRepository.findOne({
      where: { id: getQrDto.paymentId },
      relations: { student: true, class: true },
    });

    const content = `${paymentEntity.student.name} ${paymentEntity.class.name} ${paymentEntity.referenceCode}`;

    if (getQrDto && (!getQrDto.amount || getQrDto.amount <= 0)) {
      throw new BadRequestException('Số tiền phải là số nguyên lớn hơn 0');
    }

    const qrUrl = `https://qr.sepay.vn/img?acc=${acc}&bank=${bank}&amount=${getQrDto.amount}&des=${content}&template=TEMPLATE&download=${getQrDto.download}`;

    const { data } = await firstValueFrom(this.httpService.get(qrUrl));
    return (
      data && {
        qrUrl,
        studentName: paymentEntity.student.name,
        class: {
          name: paymentEntity.class.name,
          grade: paymentEntity.class.grade,
          section: paymentEntity.class.section,
          year: paymentEntity.class.year,
        },
      }
    );
  }

  async confirmPayment(confirmDto: ConfirmDto, apiKey: string) {
    const referenceCode =
      confirmDto?.referenceCode?.trim() ||
      confirmDto?.content?.trim()?.split(/\s+/).at(-1);
    const systemApiKey = this.configService.get('payment.apiKey', {
      infer: true,
    });

    if (apiKey !== `Apikey ${systemApiKey}`)
      throw new UnauthorizedException('Please authenticate');

    if (!referenceCode)
      throw new BadRequestException('Missing payment referenceCode');

    const payment = await this.paymentsRepository.findOne({
      where: { referenceCode },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    if (
      confirmDto &&
      confirmDto.transferType === 'in' &&
      confirmDto.transferAmount > 0
    ) {
      this.handleProcessPayment(payment, {
        amount: confirmDto.transferAmount,
        method: PAYMENT_METHOD.BANK_TRANSFER,
        note: confirmDto.content,
      });

      await this.paymentsRepository.save(payment);

      if (referenceCode) {
        this.paymentGateway.notifyPaymentSuccess(referenceCode, {
          paymentId: payment.id,
          status: payment.status,
          paidAmount: payment.paidAmount,
          totalAmount: payment.totalAmount,
          discountPercent: payment.discountPercent,
          amount: confirmDto.transferAmount,
          method: PAYMENT_METHOD.BANK_TRANSFER,
          note: confirmDto.content,
        });
      }

      // Send PAYMENT_SUCCESS notification
      const paymentWithRelation = await this.paymentsRepository.findOne({
        where: { id: payment.id },
        relations: ['student', 'student.parent', 'class'],
      });

      if (paymentWithRelation?.student?.parent?.id) {
        await this.notificationsService.send(
          [
            {
              actorId: null,
              recipientIds: [paymentWithRelation.student.parent.id],
              notificationType: NOTIFICATION_ENUM.PAYMENT_SUCCESS,
              data: {
                id: NOTIFICATION_ENUM.PAYMENT_SUCCESS,
                title: 'Thanh toán thành công',
                entityName: 'payments',
                body: {
                  amount: paymentWithRelation.totalAmount,
                  paidAmount: paymentWithRelation.paidAmount,
                  studentName: paymentWithRelation.student.name,
                  className: paymentWithRelation.class.name,
                  month: paymentWithRelation.month,
                  year: paymentWithRelation.year,
                },
                metadata: { entityId: paymentWithRelation.id },
              },
            },
          ],
          { isOnline: false },
        );
      }
    }
    return { success: true };
  }
}
