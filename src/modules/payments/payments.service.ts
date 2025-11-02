import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { Payment } from './payment.domain';
import { PayStudentDto } from './dto/pay-student.dto';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { User } from 'modules/users/user.domain';
import { ProcessRequestPaymentDto } from './dto/process-request-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private paymentRepository: PaymentRepository
  ) { }

  autoUpdatePaymentRecord(session: SessionEntity) {
    return this.paymentRepository.autoUpdatePaymentRecord(session)
  }

  getAllPayments(
    { filterOptions, sortOptions, paginationOptions }
      : { filterOptions: FilterPaymentDto, sortOptions: SortPaymentDto[], paginationOptions: IPaginationOptions })
    : Promise<PaginationResponseDto<Payment>> {
    return this.paymentRepository.getAllPayments({ filterOptions, sortOptions, paginationOptions })
  }

  payStudent(paymentId: Payment['id'], payStudentDto: PayStudentDto) {
    return this.paymentRepository.payStudent(paymentId, payStudentDto)
  }

  requestPayment(paymentId: Payment['id'], requestPayment: RequestPaymentDto) {
    return this.paymentRepository.requestPayment(paymentId, requestPayment);
  }

  processRequestPayment(paymentRequestId: number, processRequestPaymentDto: ProcessRequestPaymentDto, user: User) {
    return this.paymentRepository.processRequestPayment(paymentRequestId, processRequestPaymentDto, user);
  }
}
