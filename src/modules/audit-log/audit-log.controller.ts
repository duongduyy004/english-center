import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterAuditLogDto, SortAuditLogDto } from './dto/query-audit-log.dto';
import { Public } from 'decorator/customize.decorator';

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

  @Public()
  @Get(':id')
  getLogDetail(
    @Param('id') logId: string
  ) {
    return this.auditLogService.getLogDetail(logId);
  }

}
