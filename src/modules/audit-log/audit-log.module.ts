import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogChangeEntity } from './entities/audit-log-change.entity';
import { AuditLogRepository } from './audit-log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity, AuditLogChangeEntity])],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService]
})
export class AuditLogModule { }
