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

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterPermissionDto | null;
        sortOptions?: SortPermissionDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Permission>> {
        const where: FindOptionsWhere<PermissionEntity> = {};

        if (filterOptions?.path) {
            where.path = ILike(`%${filterOptions.path}%`);
        }

        if (filterOptions?.method) {
            where.method = ILike(`%${filterOptions.method}%`);
        }

        if (filterOptions?.description) {
            where.description = ILike(`%${filterOptions.description}%`);
        }

        if (filterOptions?.module) {
            where.module = ILike(`%${filterOptions.module}%`);
        }

        if (filterOptions?.module) {
            where.module = ILike(`%${filterOptions.module}%`);
        }

        if (filterOptions?.version) {
            where.module = ILike(`%${filterOptions.version}%`);
        }

        const [entities, total] = await this.permissionRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        });
        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)

        return {
            meta: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
                totalPages,
                totalItems
            },
            result: entities.map((item) => PermissionMapper.toDomain(item))
        }
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
