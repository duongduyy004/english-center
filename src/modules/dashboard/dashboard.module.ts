import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StudentEntity } from '../students/entities/student.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { TeacherPaymentEntity } from '../teacher-payments/entities/teacher-payment.entity';
import { RegistrationEntity } from '../registrations/entities/registration.entity';
import { ClassEntity } from '../classes/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity,
      PaymentEntity,
      TeacherPaymentEntity,
      RegistrationEntity,
      ClassEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
