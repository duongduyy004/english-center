import { RoleEnum } from "modules/roles/roles.enum";
import { AuditLog } from "./audit-log.domain";
import { AuditLogEntity } from "./entities/audit-log.entity";

export class AuditLogMapper {
    static toDomain(raw: AuditLogEntity): AuditLog {
        const domainEntity = new AuditLog();

        domainEntity.id = raw.id;
        domainEntity.entityName = raw.entityName;
        domainEntity.entityId = raw.entityId;
        domainEntity.path = raw.path;
        domainEntity.method = raw.method;
        domainEntity.user = {
            id: raw.userId,
            email: raw.userEmail,
            name: raw.userName,
            role: RoleEnum[raw.userRole]
        }

        return domainEntity;
    }
}