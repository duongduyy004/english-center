import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Session } from '../sessions/session.domain';

@Injectable()
export class PaymentsService {
  constructor(
    private paymentRepository: PaymentRepository
  ) { }

  autoUpdatePaymentRecord(session: Session) {
    return this.paymentRepository.autoUpdatePaymentRecord(session)
  }
}
