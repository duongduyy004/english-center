import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { FilterAuditLogDto, SortAuditLogDto } from './dto/query-audit-log.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLog } from './audit-log.domain';

@Injectable()
export class AuditLogService {
  constructor(
    private auditLogRepository: AuditLogRepository
  ) { }
  track(createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogRepository.track(createAuditLogDto);
  }

  findAll({ filterOptions, sortOptions, paginationOptions }:
    { filterOptions: FilterAuditLogDto, sortOptions: SortAuditLogDto[], paginationOptions: IPaginationOptions }) {
    return this.auditLogRepository.getAuditLogs({ filterOptions, sortOptions, paginationOptions });
  }

  pushLog(log: CreateAuditLogDto) {
    return this.auditLogRepository.pushLog(log)
  }

  getLogDetail(logId: AuditLog['id']) {
    return this.auditLogRepository.getLogDetail(logId)
  }
}
