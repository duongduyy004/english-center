import { Module } from '@nestjs/common';
import { TeacherPaymentsService } from './teacher-payments.service';
import { TeacherPaymentsController } from './teacher-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { TeacherPaymentRepository } from './teacher-payments.repository';
import { ClassesModule } from 'modules/classes/classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherPaymentEntity, SessionEntity]),
    ClassesModule,
  ],
  controllers: [TeacherPaymentsController],
  providers: [TeacherPaymentsService, TeacherPaymentRepository],
  exports: [TeacherPaymentsService, TeacherPaymentRepository],
})
export class TeacherPaymentsModule {}
