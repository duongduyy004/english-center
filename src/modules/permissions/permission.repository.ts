import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, ILike } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { Permission } from './permission.domain';
import { PermissionMapper } from './permission.mapper';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { FilterPermissionDto, SortPermissionDto } from './dto/query-permission.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class PermissionRepository {
    constructor(
        @InjectRepository(PermissionEntity)
        private permissionRepository: Repository<PermissionEntity>,
    ) { }

    async create(data: CreatePermissionDto): Promise<Permission> {
        const persistenceModel = this.permissionRepository.create(data);
        const newEntity = await this.permissionRepository.save(persistenceModel);
        return PermissionMapper.toDomain(newEntity);
    }

    async findById(id: Permission['id']): Promise<NullableType<Permission>> {
        const entity = await this.permissionRepository.findOne({
            where: { id },
        });

        return entity ? PermissionMapper.toDomain(entity) : null;
    }

    async findByPath(path: Permission['path']): Promise<NullableType<Permission>> {
        const entity = await this.permissionRepository.findOne({
            where: { path },
        });

        return entity ? PermissionMapper.toDomain(entity) : null;
    }

    async findAllGroupedByModule(): Promise<Record<string, Permission[]>> {
        const entities = await this.permissionRepository.find({
            order: { module: 'ASC', path: 'ASC' }
        });

        const permissions = entities.map(entity => PermissionMapper.toDomain(entity));

        // Group permissions by module
        const groupedPermissions: Record<string, Permission[]> = {};

        permissions.forEach(permission => {
            const module = permission.module || 'UNKNOWN';
            if (!groupedPermissions[module]) {
                groupedPermissions[module] = [];
            }
            groupedPermissions[module].push(permission);
        });

        return groupedPermissions;
    }

    async update(
        id: Permission['id'],
        payload: UpdatePermissionDto,
    ): Promise<Permission> {
        const entity = await this.permissionRepository.findOne({
            where: { id },
        });

        if (!entity) {
            throw new Error('Permission not found');
        }

        const updatedEntity = await this.permissionRepository.save(
            this.permissionRepository.create({
                ...entity,
                ...payload,
            }),
        );

        return PermissionMapper.toDomain(updatedEntity);
    }

    async remove(id: Permission['id']): Promise<void> {
        await this.permissionRepository.delete(id);
    }
}
