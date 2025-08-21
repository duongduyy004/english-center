import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { FilterAuditLogDto, SortAuditLogDto } from './dto/query-audit-log.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { ClsService } from 'nestjs-cls';
import { AuditLogMapper } from './audit-log.mapper';
import { AuditLog } from './audit-log.domain';
import { AuditLogRepository } from './audit-log.repository';

@Injectable()
export class AuditLogService {
  // Define which fields to track for each entity

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

  create(createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogRepository.create(createAuditLogDto)
  }
}
