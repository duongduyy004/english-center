import { AuditLogAction } from "@/modules/audit-log/entities/audit-log.entity";

export class CreateAuditLogDto {
    user: {
        id: string,
        name: string,
        email: string,
        role: string
    };
    entityName: string;
    entityId: string;
    path: string;
    method: string;
    action: AuditLogAction;
    changedFields: string[];
    oldValue: any;
    newValue: any;
    description?: string;
}
