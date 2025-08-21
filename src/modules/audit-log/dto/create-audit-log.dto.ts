import { User } from "@/modules/users/user.domain";

export class CreateAuditLogDto {
    user: {
        id: string,
        name: String,
        email: string,
        role: string
    };
    entityName: string;
    entityId: string;
    path: string;
    method: string;
    changedFields: string[];
    oldValue: any;
    newValue: any;
}
