import { RoleEnum } from "modules/roles/roles.enum";
import { AuditLog } from "./audit-log.domain";
import { AuditLogEntity } from "./entities/audit-log.entity";
import { ENTITY_MAP, VN_ENTITY, VN_MAPS } from "utils/audit-log/log.constant";
import _ from "lodash";

export class AuditLogMapper {
    static toDomain(raw: AuditLogEntity): AuditLog {
        const domainEntity = new AuditLog();

        domainEntity.id = raw.id;
        domainEntity.entityName = _.capitalize(VN_ENTITY[raw.entityName]);
        domainEntity.entityId = raw.entityId;
        domainEntity.path = raw.path;
        domainEntity.method = raw.method;
        domainEntity.description = raw.description;
        domainEntity.action = raw.action;
        domainEntity.user = {
            id: raw.userId,
            email: raw.userEmail,
            name: raw.userName,
            role: RoleEnum[raw.userRole]
        }

        const key = VN_MAPS[ENTITY_MAP[raw.entityName]]
        if (raw.changedFields) domainEntity.changedFields = raw.changedFields.map(item => (key[item]));
        if (raw.newValue) domainEntity.newValue = raw.newValue;
        if (raw.oldValue) domainEntity.oldValue = raw.oldValue;
        domainEntity.createdAt = raw.createdAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: AuditLog): AuditLogEntity {
        const persistenceEntity = new AuditLogEntity();

        persistenceEntity.userId = domainEntity.user.id;
        persistenceEntity.userEmail = domainEntity.user.email;
        persistenceEntity.userName = domainEntity.user.name;
        persistenceEntity.userRole = domainEntity.user.role.name;
        persistenceEntity.changedFields = domainEntity.changedFields;
        persistenceEntity.newValue = domainEntity.newValue;
        persistenceEntity.oldValue = domainEntity.oldValue;
        persistenceEntity.method = domainEntity.method;
        persistenceEntity.path = domainEntity.path;
        persistenceEntity.entityName = domainEntity.entityName;
        persistenceEntity.entityId = domainEntity.entityId;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.action = domainEntity.action;
        return persistenceEntity;
    }
}