import { Injectable } from '@nestjs/common';
import { TeacherPaymentRepository } from './teacher-payments.repository';
import {
  FilterTeacherPaymentDto,
  SortTeacherPaymentDto,
} from './dto/query-teacher-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';
import { CreateTeacherPaymentDto } from './dto/create-teacher-payment.dto';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { TeacherPayment } from './teacher-payments.domain';
import { ClassesService } from '../classes/classes.service';

@Injectable()
export class TeacherPaymentsService {
  constructor(
    private teacherPaymentsRepository: TeacherPaymentRepository,
    private classesService: ClassesService,
  ) {}

  getAllPayments({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions: FilterTeacherPaymentDto | {};
    sortOptions: SortTeacherPaymentDto[];
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<TeacherPayment>> {
    return this.teacherPaymentsRepository.getAllPayments({
      filterOptions,
      sortOptions,
      paginationOptions,
      classesService: this.classesService,
    });
  }
  createPayment(createPaymentDto: CreateTeacherPaymentDto) {
    return this.teacherPaymentsRepository.createPayment(createPaymentDto);
  }
  updatePayment(
    id: TeacherPaymentEntity['id'],
    updatePaymentDto: UpdateTeacherPaymentDto,
  ) {
    return this.teacherPaymentsRepository.updatePayment(id, updatePaymentDto);
  }
  deletePayment(id: TeacherPaymentEntity['id']) {
    return this.teacherPaymentsRepository.deletePayment(id);
  }

  autoUpdatePayment(session: SessionEntity) {
    return this.teacherPaymentsRepository.autoUpdateTeacherPaymentRecord(
      session,
    );
  }
}
