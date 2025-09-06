import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository, In } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from '@/modules/permissions/entities/permission.entity';
import { RoleMapper } from './role.mapper';
import { Role } from './role.domain';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { RemovePermissionsDto } from './dto/remove-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class RolesRepository {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repo: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity)
        private readonly permRepo: Repository<PermissionEntity>,
    ) { }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterRoleDto | null;
        sortOptions?: SortRoleDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Role>> {
        const where: FindOptionsWhere<RoleEntity> = {};

        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        const [entities, total] = await this.repo.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            relations: ['permissions'],
            order: sortOptions?.reduce(
                (acc, s) => ({ ...acc, [s.orderBy]: s.order }),
                {},
            ),
        });

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit);

        return {
            meta: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
                totalPages,
                totalItems,
            },
            result: entities.map(RoleMapper.toDomain),
        };
    }

    async create(data: CreateRoleDto): Promise<Role> {
        const persistenceModel = this.repo.create(data);
        const newEntity = await this.repo.save(persistenceModel);
        return RoleMapper.toDomain(newEntity);
    }

    async findById(id: Role['id']): Promise<NullableType<Role>> {
        const entity = await this.repo.findOne({
            where: { id },
            relations: ['permissions'],
        });

        return entity ? RoleMapper.toDomain(entity) : null;
    }

    async update(id: Role['id'], payload: UpdateRoleDto): Promise<Role> {
        const entity = await this.repo.findOne({
            where: { id },
            relations: ['permissions'],
        });

        if (!entity) {
            throw new NotFoundException('Role not found');
        }

        // Update basic role properties
        const updatedEntity = await this.repo.save(
            this.repo.create({
                ...entity,
                name: payload.name !== undefined ? payload.name : entity.name,
                description: payload.description !== undefined ? payload.description : entity.description,
                isActive: payload.isActive !== undefined ? payload.isActive : entity.isActive
            }),
        );

        // Update permissions if provided
        if (payload.permissionIds.length > 0) {
            const permissions = await this.permRepo.find({
                where: { id: In(payload.permissionIds) }
            });

            // Replace all permissions with new ones
            updatedEntity.permissions = permissions;
            await this.repo.save(updatedEntity);
        }

        // Return updated entity with permissions
        const finalEntity = await this.repo.findOne({
            where: { id },
            relations: ['permissions'],
        });

        return RoleMapper.toDomain(finalEntity);
    }

    async remove(id: Role['id']): Promise<void> {
        const entity = await this.repo.findOne({
            where: { id },
        });

        if (!entity) {
            throw new NotFoundException('Role not found');
        }

        await this.repo.delete(id);
    }
}
