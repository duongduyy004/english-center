import { InjectRepository } from "@nestjs/typeorm";
import { AuditLogEntity } from "./entities/audit-log.entity";
import { Between, DataSource, FindOptionsWhere, ILike, Repository } from "typeorm";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";
import { FilterAuditLogDto, SortAuditLogDto } from "./dto/query-audit-log.dto";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";
import { AuditLog } from "./audit-log.domain";
import { AuditLogMapper } from "./audit-log.mapper";
import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { ENTITY_MAP, VN_ACTION, VN_ENTITY, VN_MAPS } from "utils/audit-log/log.constant";
import _, { capitalize } from "lodash";

// Import all mappers
import { UserMapper } from "@/modules/users/user.mapper";
import { StudentMapper } from "@/modules/students/student.mapper";
import { TeacherMapper } from "@/modules/teachers/teacher.mapper";
import { ParentMapper } from "@/modules/parents/parent.mapper";
import { ClassMapper } from "@/modules/classes/class.mapper";
import { PaymentMapper } from "@/modules/payments/payment.mapper";
import { SessionMapper } from "@/modules/sessions/session.mapper";
import { TeacherPaymentMapper } from "@/modules/teacher-payments/teacher-payments.mapper";
import { MenuMapper } from "@/modules/menus/menu.mapper";
import { RoleMapper } from "@/modules/roles/role.mapper";
import { PermissionMapper } from "@/modules/permissions/permission.mapper";
import { ArticleMapper } from "@/modules/articles/article.mapper";
import { AdvertisementMapper } from "@/modules/advertisements/advertisement.mapper";
import { RegistrationMapper } from "@/modules/registrations/registration.mapper";
import { TransactionMapper } from "@/modules/transactions/transaction.mapper";
import { FeedbackMapper } from "@/modules/feedback/feedback.mapper";
import { IntroductionMapper } from "@/modules/introduction/introduction.mapper";
import { AuditLogAction } from "subscribers/audit-log.constants";
import logMapper from "utils/audit-log/log.mapper";

// Mapper registry - maps entity names to their respective mappers
const ENTITY_MAPPER_REGISTRY: Record<string, any> = {
    'UserEntity': UserMapper,
    'StudentEntity': StudentMapper,
    'TeacherEntity': TeacherMapper,
    'ParentEntity': ParentMapper,
    'ClassEntity': ClassMapper,
    'PaymentEntity': PaymentMapper,
    'SessionEntity': SessionMapper,
    'TeacherPaymentEntity': TeacherPaymentMapper,
    'MenuEntity': MenuMapper,
    'RoleEntity': RoleMapper,
    'PermissionEntity': PermissionMapper,
    'ArticleEntity': ArticleMapper,
    'AdvertisementEntity': AdvertisementMapper,
    'RegistrationEntity': RegistrationMapper,
    'TransactionEntity': TransactionMapper,
    'FeedbackEntity': FeedbackMapper,
    'IntroductionEntity': IntroductionMapper,
};

@Injectable()
export class AuditLogRepository {
    constructor(
        @InjectRepository(AuditLogEntity) private auditLogRepository: Repository<AuditLogEntity>,
        @InjectQueue('audit-log') private auditLogQueue: Queue,
        private readonly dataSource: DataSource
    ) { }

    async track(data: CreateAuditLogDto) {
        if (!data || data.changedFields.length === 0) return;
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

    async getAuditLogs(
        { filterOptions, sortOptions = [{ order: 'DESC', orderBy: 'createdAt' }], paginationOptions }:
            { filterOptions: FilterAuditLogDto, sortOptions: SortAuditLogDto[], paginationOptions: IPaginationOptions }
    ): Promise<PaginationResponseDto<AuditLog>> {
        const where: FindOptionsWhere<AuditLogEntity> = {}

        if (filterOptions?.userEmail) where.userEmail = ILike(filterOptions.userEmail);
        if (filterOptions?.entityName) where.entityName = filterOptions.entityName;
        if (filterOptions?.entityId) where.entityId = filterOptions.entityId;
        if (filterOptions?.startTime && filterOptions?.endTime) {
            where.createdAt = Between(filterOptions.startTime, filterOptions.endTime);
        }

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
        let newValue = logMapper(data.newValue, ENTITY_MAP[data.entityName] || data.entityName);
        let oldValue = logMapper(data.oldValue, ENTITY_MAP[data.entityName] || data.entityName);

        const userName = `<strong>${data.user.name}</strong>`;
        const userEmail = `<em>${data.user.email}</em>`;
        const entityName = `<strong>${VN_ENTITY[data.entityName] || data.entityName}</strong>`;
        const action = `<strong>${capitalize(VN_ACTION[data.action] || data.action)}</strong>`;

        if (data.action === AuditLogAction.CREATE) {
            const changeList = this.generateInsertAndDeleteList(newValue);
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        }
        else if (data.action === AuditLogAction.UPDATE) {
            const changeList = Object.keys(newValue).map(item =>
                `<li><strong>${capitalize(item)}</strong>: <span style="color: #666;">${oldValue[item]}</span> → <span style="color: blue;">${newValue[item]}</span></li>`
            ).join('');
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        } else if (data.action === AuditLogAction.DELETE) {
            const changeList = this.generateInsertAndDeleteList(oldValue)
            return `${action} ${entityName} bởi ${userName} - ${userEmail}:<ul style="margin: 8px 0; padding-left: 20px;">${changeList}</ul>`;
        }
        return '';
    }

    async getLogDetail(logId: AuditLog['id']) {
        const logEntity = await this.auditLogRepository.findOne({
            where: { id: logId }
        })

        const { entityId, entityName } = logEntity
        const repository = this.dataSource.getRepository(entityName);
        const entity = await repository.findOne({
            where: { id: entityId }
        })

        return this.mapEntityToDomain(entityName, entity);

    }

    private generateInsertAndDeleteList(data: any) {
        let result = ""
        if (Array.isArray(data)) return data.map(item => this.generateInsertAndDeleteList(item))
        for (const [key, value] of Object.entries(data)) {
            if (value === null || value === undefined) continue;
            if (typeof value === 'object') {
                result += `<li><strong>${capitalize(key)}</strong>: <span><ul>${this.generateInsertAndDeleteList(value)}</ul></span></li>`
            }
            else {
                result += `<li><strong>${capitalize(key)}</strong>: <span style="color: green;">${value}</span></li>`
            }
        }
        return result
    }

    private generateUpdateList(oldValue: any, newValue: any) {
        let result = ""
        if (Array.isArray(newValue)) return newValue.map((item, index) => this.generateUpdateList(oldValue[index], item))
        for (const [key, value] of Object.entries(newValue)) {
            if (value === null || value === undefined) continue;
            if (typeof value === 'object') {
                result += `<li><strong>${capitalize(key)}</strong>: <span><ul>${this.generateUpdateList(oldValue[key], value)}</ul></span></li>`
            }
            else {
                result += `<li><strong>${capitalize(key)}</strong>: <span style="color: #666;">${oldValue[key]}</span> → <span style="color: blue;">${newValue[key]}</span></li>`
            }
        }
        return result
    }

    private mapEntityToDomain(entityName: string, entity: any): any {
        if (!entity) return null;

        const mapper = ENTITY_MAPPER_REGISTRY[entityName];

        if (!mapper || !mapper.toDomain) {
            console.warn(`No mapper found for entity: ${entityName}. Returning raw entity.`);
            return entity;
        }

        try {
            return logMapper(mapper.toDomain(entity), ENTITY_MAP[entityName]);
        } catch (error) {
            console.error(`Error mapping ${entityName} to domain:`, error);
            return entity;
        }
    }
}