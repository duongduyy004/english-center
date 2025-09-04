import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleMapper } from './role.mapper';
import { Role } from './role.domain';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';

@Injectable()
export class RolesRepository {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly repo: Repository<RoleEntity>,
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
}
