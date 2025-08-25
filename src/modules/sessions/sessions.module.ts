import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entities/session.entity';
import { AttendanceSessionEntity } from './entities/attendance-session.entity';
import { ClassesModule } from 'modules/classes/classes.module';
import { SessionRepository } from './session.repository';
import { StudentsModule } from 'modules/students/students.module';
import { PaymentsModule } from 'modules/payments/payments.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, AttendanceSessionEntity]),
    ClassesModule,
    StudentsModule,
    PaymentsModule,
    AuditLogModule
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionRepository],
  exports: [SessionsService]
})
export class SessionsModule { }
