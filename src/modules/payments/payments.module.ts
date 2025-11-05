import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentEntity } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRepository } from './payment.repository';
import { PaymentRequestEntity } from './entities/payment.request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, PaymentRequestEntity])],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository],
  exports: [PaymentsService]
})
export class PaymentsModule { }
