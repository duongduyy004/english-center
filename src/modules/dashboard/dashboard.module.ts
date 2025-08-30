import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { StudentEntity } from '../students/entities/student.entity';
import { PaymentEntity } from '../payments/entities/payment.entity';
import { TeacherPaymentEntity } from '../teacher-payments/entities/teacher-payment.entity';
import { RegistrationEntity } from '../registrations/entities/registration.entity';
import { ClassEntity } from '../classes/entities/class.entity';
import { DashboardRepository } from './dashboard.repository';
import { TeacherEntity } from '../teachers/entities/teacher.entity';
import { ParentEntity } from '../parents/entities/parent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentEntity,
      PaymentEntity,
      TeacherPaymentEntity,
      RegistrationEntity,
      ClassEntity,
      TeacherEntity,
      ParentEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
