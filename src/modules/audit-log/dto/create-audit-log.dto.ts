import { User } from "@/modules/users/user.domain";

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
    action: string;
    changedFields: string[];
    oldValue: any;
    newValue: any;
    description?: string;
}
