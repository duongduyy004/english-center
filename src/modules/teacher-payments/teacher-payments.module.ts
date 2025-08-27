import { Module } from '@nestjs/common';
import { TeacherPaymentsService } from './teacher-payments.service';
import { TeacherPaymentsController } from './teacher-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { TeacherPaymentRepository } from './teacher-payments.repository';
import { SessionsModule } from 'modules/sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherPaymentEntity]), SessionsModule],
  controllers: [TeacherPaymentsController],
  providers: [TeacherPaymentsService, TeacherPaymentRepository],
})
export class TeacherPaymentsModule {}
