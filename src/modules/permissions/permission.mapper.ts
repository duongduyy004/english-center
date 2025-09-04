import { PermissionEntity } from "./entities/permission.entity";
import { Permission } from "./permission.domain";

export class PermissionMapper {
    static toDomain(raw: PermissionEntity): Permission {
        const domainEntity = new Permission();
        domainEntity.id = raw.id;
        domainEntity.path = raw.path;
        domainEntity.method = raw.method;
        domainEntity.description = raw.description;
        domainEntity.module = raw.module;
        domainEntity.version = raw.version;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;

        return domainEntity;
    }
}
