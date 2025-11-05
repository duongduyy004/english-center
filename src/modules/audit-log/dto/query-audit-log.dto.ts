import { AuditLog } from "../audit-log.domain";

export class FilterAuditLogDto {
    userEmail: string;
    entityName: string;
    entityId: string;
    startTime: Date;
    endTime: Date;
}

export class SortAuditLogDto {
    orderBy: keyof AuditLog;
    order: 'ASC' | 'DESC';
}