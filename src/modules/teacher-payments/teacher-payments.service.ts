import { Injectable } from '@nestjs/common';
import { TeacherPaymentRepository } from './teacher-payments.repository';
import { FilterTeacherPaymentDto, SortTeacherPaymentDto } from './dto/query-teacher-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';

@Injectable()
export class TeacherPaymentsService {
  constructor(
    private teacherPaymentsRepository: TeacherPaymentRepository
  ) { }

  getAllPayments({ filterOptions, sortOptions, paginationOptions }
    : { filterOptions: FilterTeacherPaymentDto, sortOptions: SortTeacherPaymentDto[], paginationOptions: IPaginationOptions }) {
    return this.teacherPaymentsRepository.getAllPayments({ filterOptions, sortOptions, paginationOptions })
  }
}
