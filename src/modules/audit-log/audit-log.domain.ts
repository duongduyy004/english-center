import { Role } from "modules/roles/role.domain";

export class AuditLog {
    id: string;

    user: {
        id: string,
        name: string,
        email: string,
        role: Role
    }

    entity: string;

    entityId: string;

    path: string;

    method: string;

    changes: {
        fieldName: string,
        oldValue: string,
        newValue: string
    }[]
}