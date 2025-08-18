import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterAuditLogDto, SortAuditLogDto } from './dto/query-audit-log.dto';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) { }

  @Get()
  findAll(@Query() query: QueryDto<FilterAuditLogDto, SortAuditLogDto>) {
    const limit = query.limit;
    const page = query.page;
    return this.auditLogService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        limit, page
      }
    });
  }

}
