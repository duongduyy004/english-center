import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLogRepository } from './audit-log.repository';
import { FilterAuditLogDto, SortAuditLogDto } from './dto/query-audit-log.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';

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
}
