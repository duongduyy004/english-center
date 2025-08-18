import { User } from "@/modules/users/user.domain";

export class CreateAuditLogDto {
    user: User;
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
