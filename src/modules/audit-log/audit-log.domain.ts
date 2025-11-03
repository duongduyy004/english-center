import { Role } from "modules/roles/role.domain";
import { AuditLogAction } from "./entities/audit-log.entity";

export class AuditLog {
    id: string;

    user: {
        id: string,
        name: string,
        email: string,
        role: Role
    }

    entityName: string;

    entityId: string;

    description: string

    path: string;

    method: string;

    action: AuditLogAction;

    changedFields: string[];

    oldValue: any

    newValue: any

    createdAt: Date;
}