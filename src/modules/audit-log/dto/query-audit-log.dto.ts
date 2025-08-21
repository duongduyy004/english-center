import { AuditLog } from "../audit-log.domain";

export class FilterAuditLogDto {
    userId: string;
    entityName: string;
    entityId: string;
}

export class SortAuditLogDto {
    orderBy: keyof AuditLog;
    order: 'ASC' | 'DESC';
}