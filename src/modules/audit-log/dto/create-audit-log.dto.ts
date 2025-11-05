import { AuditLogAction } from "subscribers/audit-log.constants";

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
