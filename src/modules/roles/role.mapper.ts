import { Role } from './role.domain';
import { RoleEntity } from './entities/role.entity';

export class RoleMapper {
    static toDomain(raw: RoleEntity): Role {
        const domainEntity = new Role();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.isActive = raw.isActive;
        domainEntity.description = raw.description;
        if (raw.permissions) {
            domainEntity.permissions = raw.permissions.map(item => ({
                id: item.id,
                path: item.path,
                method: item.method,
                module: item.module,
                description: item.description,
                version: item.version
            }))
        }
        return domainEntity;
    }
}
