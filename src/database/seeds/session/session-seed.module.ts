import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { AttendanceSessionEntity } from 'modules/sessions/entities/attendance-session.entity';
import { ClassEntity } from 'modules/classes/entities/class.entity';
import { StudentEntity } from 'modules/students/entities/student.entity';
import { SessionSeedService } from './session-seed.service';
import { PaymentsModule } from 'modules/payments/payments.module';
import { TeacherPaymentsModule } from 'modules/teacher-payments/teacher-payments.module';
import { PaymentEntity } from 'modules/payments/entities/payment.entity';
import { TeacherPaymentEntity } from 'modules/teacher-payments/entities/teacher-payment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SessionEntity,
            AttendanceSessionEntity,
            ClassEntity,
            StudentEntity,
            PaymentEntity,
            TeacherPaymentEntity
        ]),
        PaymentsModule,
        TeacherPaymentsModule,
    ],
    providers: [SessionSeedService],
    exports: [SessionSeedService],
})
export class SessionSeedModule { }
