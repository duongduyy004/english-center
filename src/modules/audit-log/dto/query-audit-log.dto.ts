import { AuditLog } from "../audit-log.domain";

export class FilterAuditLogDto {
    userId: string;
    entity: string;
    entityId: string;
}

export class SortAuditLogDto {
    orderBy: keyof AuditLog;
    order: 'ASC' | 'DESC';
}