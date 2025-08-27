import { InjectRepository } from '@nestjs/typeorm';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import {
  FilterTeacherPaymentDto,
  SortTeacherPaymentDto,
} from './dto/query-teacher-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { SessionsService } from 'modules/sessions/sessions.service';

import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';

export class TeacherPaymentRepository {
  constructor(
    @InjectRepository(TeacherPaymentEntity)
    private teacherPaymentRepository: Repository<TeacherPaymentEntity>,
    private sessionsService: SessionsService,
  ) {}

  async autoUpdateTeacherPaymentRecord(session: SessionEntity) {
    const totalLessons = await this.sessionsService.getSessions(
      session.classId,
    );
  }

  async getAllPayments({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterTeacherPaymentDto;
    sortOptions: SortTeacherPaymentDto[];
    paginationOptions: IPaginationOptions;
  }) {
    const where: FindOptionsWhere<TeacherPaymentEntity> = {};

    if (filterOptions?.teacherId) where.teacherId = filterOptions.teacherId;

    if (filterOptions?.status) where.status = filterOptions.status;

    if (filterOptions?.month) where.month = filterOptions.month;

    if (filterOptions?.year) where.year = filterOptions.year;

    if (filterOptions?.startMonth && filterOptions?.endMonth) {
      where.month = Between(filterOptions.startMonth, filterOptions.endMonth);
      where.year = filterOptions.year;
    }

    const [entities, total] = await this.teacherPaymentRepository.findAndCount({
      where: where,
      relations: ['teacher'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
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
      result: entities,
    };
  }
  async createPayment(createPaymentDto) {
    const payment = this.teacherPaymentRepository.create(createPaymentDto);
    return this.teacherPaymentRepository.save(payment);
  }
  async updatePayment(
    id: TeacherPaymentEntity['id'],
    updatePaymentDto: UpdateTeacherPaymentDto,
  ) {
    await this.teacherPaymentRepository.update(id, updatePaymentDto);
    return this.teacherPaymentRepository.findOne({ where: { id } });
  }
  async deletePayment(id: TeacherPaymentEntity['id']) {
    return this.teacherPaymentRepository.delete(id);
  }
}
