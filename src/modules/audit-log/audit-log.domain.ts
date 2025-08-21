import { Role } from "modules/roles/role.domain";

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

    path: string;

    method: string;

    changedFields: string[];

    oldValue: any

    newValue: any

    createdAt: Date;
}