import { Role } from './role.domain';
import { RoleEntity } from './entities/role.entity';
import { getModuleNameVi } from 'utils/module-name.constant';

export class RoleMapper {
    static toDomain(raw: RoleEntity): Role {
        const domainEntity = new Role();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.isActive = raw.isActive;
        domainEntity.description = raw.description;
        domainEntity.isStaff = raw.isStaff;
        domainEntity.isSystem = raw.isSystem;
        if (raw.permissions) {
            domainEntity.permissions = raw.permissions.map(item => ({
                id: item.id,
                path: item.path,
                method: item.method,
                module: getModuleNameVi(item.module),
                description: item.description
            }))
        }
        return domainEntity;
    }
}
