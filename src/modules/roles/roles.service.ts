import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RemovePermissionsDto } from './dto/remove-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
    ) { }

    async findAll(query: QueryDto<FilterRoleDto, SortRoleDto>) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        return this.rolesRepository.findManyWithPagination({
            filterOptions: query.filters,
            sortOptions: query.sort,
            paginationOptions: { page, limit },
        });
    }

    async create(createRoleDto: CreateRoleDto) {
        return this.rolesRepository.create(createRoleDto);
    }

    async findOne(id: number) {
        const role = await this.rolesRepository.findById(id);
        if (!role) {
            throw new NotFoundException('Role not found');
        }
        return role;
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        return this.rolesRepository.update(id, updateRoleDto);
    }

    async remove(id: number) {
        await this.rolesRepository.remove(id);
        return { message: 'Role deleted successfully' };
    }
}
