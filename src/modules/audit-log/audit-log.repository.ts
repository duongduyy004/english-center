import { InjectRepository } from "@nestjs/typeorm";
import { AuditLogEntity } from "./entities/audit-log.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { AuditLogChangeEntity } from "./entities/audit-log-change.entity";
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
        @InjectRepository(AuditLogChangeEntity) private auditLogChangeRepository: Repository<AuditLogChangeEntity>
    ) { }

    async track(createAuditLogDto: CreateAuditLogDto) {
        if (createAuditLogDto.changes.length === 0) return;
        const newLog = await this.auditLogRepository.save(
            this.auditLogRepository.create({
                entity: createAuditLogDto.entity,
                entityId: createAuditLogDto.entityId,
                path: createAuditLogDto.path,
                method: createAuditLogDto.method,
                userId: createAuditLogDto.user.id,
                userEmail: createAuditLogDto.user.email,
                userName: createAuditLogDto.user.name,
                userRole: createAuditLogDto.user.role.name,
            })
        )


        let auditLogChanges = []
        for (const item of createAuditLogDto.changes) {
            auditLogChanges.push(this.auditLogChangeRepository.create({
                auditLog: newLog,
                fieldName: item.fieldName,
                oldValue: item.oldValue,
                newValue: item.newValue
            }))
        }
        await this.auditLogChangeRepository.save(auditLogChanges)
    }

    async getAuditLogs(
        { filterOptions, sortOptions, paginationOptions }:
            { filterOptions: FilterAuditLogDto, sortOptions: SortAuditLogDto[], paginationOptions: IPaginationOptions }
    ): Promise<PaginationResponseDto<AuditLog>> {
        const where: FindOptionsWhere<AuditLogEntity> = {}

        if (filterOptions?.userId) where.userId = filterOptions.userId;
        if (filterOptions?.entity) where.entity = filterOptions.entity;
        if (filterOptions?.entityId) where.entityId = filterOptions.entityId;

        const [entities, total] = await this.auditLogRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            relations: { changes: true },
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