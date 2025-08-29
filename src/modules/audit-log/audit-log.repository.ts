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
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { VN_ACTION, VN_ENTITY, VN_FIELD } from "@/utils/log.mapper";
import { capitalize } from "lodash";

@Injectable()
export class AuditLogRepository {
    constructor(
        @InjectRepository(AuditLogEntity) private auditLogRepository: Repository<AuditLogEntity>,
        @InjectQueue('audit-log') private auditLogQueue: Queue,
    ) { }

    async track(data: CreateAuditLogDto) {
        const description = data.description ? data.description : this.generateDescription(data);
        const log = this.auditLogRepository.create({
            userId: data.user.id,
            userEmail: data.user.email,
            userName: data.user.name,
            userRole: data.user.role,
            entityName: data.entityName,
            entityId: data.entityId,
            changedFields: data.changedFields,
            method: data.method,
            path: data.path,
            newValue: data.newValue,
            oldValue: data.oldValue,
            description: description,
            action: data.action
        })
        await this.auditLogRepository.save(log, { listeners: false })
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

    async pushLog(log: CreateAuditLogDto) {
        await this.auditLogQueue.add('createLog', log)
    }

    private generateDescription(data: CreateAuditLogDto) {
        let returnData = {}
        for (const field of data.changedFields) {
            const vnField = VN_FIELD[field];
            if (!vnField) return;
            returnData = {
                ...returnData,
                [vnField]: {
                    newValue: data.newValue[field],
                    oldValue: data.oldValue[field]
                }
            }
        }

        const userName = `<strong>${data.user.name}</strong>`;
        const userEmail = `<em>${data.user.email}</em>`;
        const entityName = `<strong>${VN_ENTITY[data.entityName]}</strong>`;
        const action = `<strong>${capitalize(VN_ACTION[data.action])}</strong>`;

        if (data.action === 'CREATE') {
            const changeList = Object.keys(returnData).map(item =>
                `<li><strong>${capitalize(item)}</strong>: <span style="color: green;">${returnData[item].newValue}</span></li>`
            ).join('');
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        }
        else if (data.action === 'UPDATE') {
            const changeList = Object.keys(returnData).map(item =>
                `<li><strong>${capitalize(item)}</strong>: <span style="color: #666;">${returnData[item].oldValue}</span> → <span style="color: blue;">${returnData[item].newValue}</span></li>`
            ).join('');
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        } else if (data.action === 'DELETE') {
            const changeList = Object.keys(returnData).map(item =>
                `<li><strong>${capitalize(item)}</strong>: <span style="color: red; text-decoration: line-through;">${returnData[item].oldValue}</span></li>`
            ).join('');
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        }
        return '';
    }
}