import { InjectRepository } from "@nestjs/typeorm";
import { AuditLogEntity } from "./entities/audit-log.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";
import { FilterAuditLogDto, SortAuditLogDto } from "./dto/query-audit-log.dto";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";
import { AuditLog } from "./audit-log.domain";
import { AuditLogMapper } from "./audit-log.mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuditLogRepository {
    constructor(
        @InjectRepository(AuditLogEntity) private auditLogRepository: Repository<AuditLogEntity>,
    ) { }

    async track(createAuditLogDto: CreateAuditLogDto) {
        await this.auditLogRepository.save(
            this.auditLogRepository.create(createAuditLogDto)
        )
    }

    create(createAuditLogDto: CreateAuditLogDto) {
        return this.auditLogRepository.create(createAuditLogDto)
    }

    async getAuditLogs(
        { filterOptions, sortOptions, paginationOptions }:
            { filterOptions: FilterAuditLogDto, sortOptions: SortAuditLogDto[], paginationOptions: IPaginationOptions }
    ): Promise<PaginationResponseDto<AuditLog>> {
        const where: FindOptionsWhere<AuditLogEntity> = {}

        if (filterOptions?.userId) where.userId = filterOptions.userId;
        if (filterOptions?.entityName) where.entityName = filterOptions.entityName;
        if (filterOptions?.entityId) where.entityId = filterOptions.entityId;

        const [entities, total] = await this.auditLogRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)

        return {
            meta: {
                limit: paginationOptions.limit,
                page: paginationOptions.page,
                totalPages,
                totalItems
            },
            result: entities ? entities.map(item => AuditLogMapper.toDomain(item)) : null
        }

    }
}