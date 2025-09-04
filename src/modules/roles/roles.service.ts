import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RemovePermissionsDto } from './dto/remove-permissions.dto';
import { RolesRepository } from './roles.repository';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity) private permRepo: Repository<PermissionEntity>,
        private readonly rolesRepository: RolesRepository,
    ) { }

    async assignPermissions(dto: AssignPermissionsDto) {
        const role = await this.roleRepo.findOne({ where: { id: dto.roleId }, relations: ['permissions'] });
        if (!role) throw new NotFoundException('Role not found');

        const permissions = await this.permRepo.find({ where: { id: In(dto.permissionIds) } });
        if (!permissions.length) throw new NotFoundException('Permissions not found');

        const existingPermission = role.permissions;

        for (const perm of permissions) {
            for (const item of existingPermission) {
                if (perm.id !== item.id) role.permissions.push(perm);
            }
        }

        await this.roleRepo.save(role);
        return { roleId: role.id, permissionIds: permissions.map(p => p.id) };
    }

    async removePermissions(dto: RemovePermissionsDto) {
        const role = await this.roleRepo.findOne({ where: { id: dto.roleId }, relations: ['permissions'] });
        if (!role) throw new NotFoundException('Role not found');

        const originalIds = role.permissions.map(p => p.id);
        const removeSet = new Set(dto.permissionIds);
        const remainingPermissions = role.permissions.filter(p => !removeSet.has(p.id));
        const removedPermissionIds = originalIds.filter(id => removeSet.has(id));

        // If none matched, still return (noop) to keep idempotency
        role.permissions = remainingPermissions;
        await this.roleRepo.save(role);

        return {
            roleId: role.id,
            removedPermissionIds,
            remainingPermissionIds: remainingPermissions.map(p => p.id)
        };
    }

    async findAll(query: QueryDto<FilterRoleDto, SortRoleDto>) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        return this.rolesRepository.findManyWithPagination({
            filterOptions: query.filters,
            sortOptions: query.sort,
            paginationOptions: { page, limit },
        });
    }
}
