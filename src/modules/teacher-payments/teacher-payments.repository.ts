import { InjectRepository } from '@nestjs/typeorm';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { Between, FindOptionsWhere, Repository, In } from 'typeorm';
import {
  FilterTeacherPaymentDto,
  SortTeacherPaymentDto,
} from './dto/query-teacher-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';
import {
  CreateTeacherPaymentDto,
  HistoryDto,
} from './dto/create-teacher-payment.dto';
import { TeacherPaymentMapper } from './teacher-payments.mapper';
import { TeacherPayment } from './teacher-payments.domain';
import { ClassesService } from '../classes/classes.service';
import { BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { method } from 'lodash';

export class TeacherPaymentRepository {
  constructor(
    @InjectRepository(TeacherPaymentEntity)
    private teacherPaymentRepository: Repository<TeacherPaymentEntity>,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private classesService: ClassesService,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async autoUpdateTeacherPaymentRecord(session: SessionEntity) {
    const classInfo = await this.classesService.findOne(session.classId);
    if (!classInfo || !classInfo.teacher) {
      throw new BadRequestException(
        this.i18nService.t('teacherPayment.FAIL.CLASS_TEACHER_NOT_FOUND'),
      );
    }

    const month = session.date.getMonth() + 1;
    const year = session.date.getFullYear();

    // Check if there was any payment record for the teacher in the current month and year
    let teacherPayment: TeacherPaymentEntity =
      await this.teacherPaymentRepository.findOne({
        where: {
          teacherId: classInfo.teacher.id,
          month: month,
          year: year,
        },
      });

    // Get total sessions for this teacher in this month/year across all classes
    const teacherClasses = await this.classesService.findClassesByTeacherId(
      classInfo.teacher.id,
    );
    const classIds = teacherClasses.map((cls) => cls.id);

    let totalSessions = 0;
    if (classIds.length > 0) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      totalSessions = await this.sessionRepository.count({
        where: {
          classId: In(classIds),
          date: Between(startDate, endDate),
        },
      });
    }

    // Calculate total amount based on sessions * salary per lesson
    const totalAmount = totalSessions * classInfo.teacher.salaryPerLesson;

    if (!teacherPayment) {
      // If no record exists, create a new one
      teacherPayment = this.teacherPaymentRepository.create({
        month: month,
        year: year,
        totalAmount: totalAmount,
        paidAmount: 0,
        status: 'pending',
        teacherId: classInfo.teacher.id,
        classes: [],
        histories: [],
      });
    } else {
      // Update existing record
      teacherPayment.totalAmount = totalAmount;

      // Update status based on payment completion
      if (teacherPayment.paidAmount >= totalAmount) {
        teacherPayment.status = 'paid';
      } else if (teacherPayment.paidAmount > 0) {
        teacherPayment.status = 'partial';
      } else {
        teacherPayment.status = 'pending';
      }
    }

    // Update or add class lesson information
    const existingClassIndex = teacherPayment.classes.findIndex(
      (cls) => cls.classId === session.classId,
    );

    const classSessionCount = await this.sessionRepository.count({
      where: {
        classId: session.classId,
        date: Between(
          new Date(year, month - 1, 1),
          new Date(year, month, 0, 23, 59, 59, 999),
        ),
      },
    });

    if (existingClassIndex >= 0) {
      teacherPayment.classes[existingClassIndex].totalLessons =
        classSessionCount;
    } else {
      teacherPayment.classes.push({
        classId: session.classId,
        class: {
          id: classInfo.id,
          name: classInfo.name,
        },
        totalLessons: classSessionCount,
      });
    }

    return await this.teacherPaymentRepository.save(teacherPayment);
  }
  async getAllPayments({
    filterOptions,
    sortOptions,
    paginationOptions,
    classesService,
  }: {
    filterOptions: FilterTeacherPaymentDto | {};
    sortOptions: SortTeacherPaymentDto[];
    paginationOptions: IPaginationOptions;
    classesService?: ClassesService;
  }): Promise<PaginationResponseDto<TeacherPayment>> {
    const where: FindOptionsWhere<TeacherPaymentEntity> = {};

    // Type guard to check if filterOptions has the expected properties
    const filters = filterOptions as FilterTeacherPaymentDto;

    if (filters?.teacherId) where.teacherId = filters.teacherId;

    if (filters?.status) where.status = filters.status;

    if (filters?.month) where.month = filters.month;

    if (filters?.year) where.year = filters.year;

    if (filters?.startMonth && filters?.endMonth && filters?.year) {
      where.month = Between(filters.startMonth, filters.endMonth);
      where.year = filters.year;
    }

    const [entities, total] = await this.teacherPaymentRepository.findAndCount({
      where: where,
      relations: ['teacher'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order:
        sortOptions.length > 0
          ? sortOptions.reduce((acc, sort) => {
              acc[sort.orderBy] = sort.order;
              return acc;
            }, {})
          : { year: 'DESC', month: 'DESC' },
    });

    const totalItems = total;
    const totalPages = Math.ceil(totalItems / paginationOptions.limit);

    return {
      meta: {
        limit: paginationOptions.limit,
        page: paginationOptions.page,
        totalPages,
        totalItems,
      },
      result: await TeacherPaymentMapper.toDomainList(entities, classesService),
    };
  }
  async createPayment(createPaymentDto: CreateTeacherPaymentDto) {
    const payment = this.teacherPaymentRepository.create(createPaymentDto);
    return this.teacherPaymentRepository.save(payment);
  }

  async updatePayment(
    id: TeacherPaymentEntity['id'],
    updatePaymentDto: UpdateTeacherPaymentDto,
  ) {
    const oldPayment = await this.teacherPaymentRepository.findOne({
      where: { id },
    });

    if (!oldPayment) {
      throw new BadRequestException(
        this.i18nService.t('teacherPayment.FAIL.PAYMENT_NOT_FOUND'),
      );
    }

    if (oldPayment.status === 'paid') {
      throw new BadRequestException(
        this.i18nService.t('teacherPayment.FAIL.PAYMENT_ALREADY_COMPLETED'),
      );
    }

    if (updatePaymentDto.paidAmount && updatePaymentDto.paidAmount > 0) {
      const remainingAmount = oldPayment.totalAmount - oldPayment.paidAmount;
      if (updatePaymentDto.paidAmount > remainingAmount) {
        throw new BadRequestException(
          this.i18nService.t('teacherPayment.FAIL.EXCEED_AMOUNT'),
        );
      }

      const newHistory = {
        method: updatePaymentDto.histories?.[0]?.method || 'banking',
        amount: updatePaymentDto.paidAmount,
        note: updatePaymentDto.histories?.[0]?.note || '',
        date: new Date(),
      };

      const updatedPayment = this.teacherPaymentRepository.merge(oldPayment, {
        ...updatePaymentDto,
        histories: [...oldPayment.histories, newHistory],
      });

      return await this.teacherPaymentRepository.save(updatedPayment);
    }

    const updatedPayment = this.teacherPaymentRepository.merge(
      oldPayment,
      updatePaymentDto,
    );
    return await this.teacherPaymentRepository.save(updatedPayment);
  }

  async deletePayment(id: TeacherPaymentEntity['id']) {
    return this.teacherPaymentRepository.delete(id);
  }
}
