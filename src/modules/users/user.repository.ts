import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { User } from './user.domain';
import { UserMapper } from './user.mapper';
import { NullableType } from 'utils/types/nullable.type';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly i18nService: I18nService<I18nTranslations>,
    ) { }

    async create(data: CreateStaffDto): Promise<User> {
        const newEntity = await this.userRepository.save(
            this.userRepository.create({ ...data, role: { id: data.roleId } }),
        );
        return UserMapper.toDomain(newEntity);
    }

    async findById(id: User['id']): Promise<NullableType<User>> {
        const entity = await this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });
        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<User>> {
        const where: FindOptionsWhere<UserEntity> = {};

        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.email) {
            where.email = ILike(`%${filterOptions.email}%`);
        }

        const [entities, total] = await this.userRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: ['role'],
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
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
            result: entities.map((user) => UserMapper.toDomain(user)),
        };
    }

    async update(id: User['id'], payload: UpdateStaffDto): Promise<User> {
        const entity = await this.userRepository.findOne({
            where: { id },
            relations: ['role'],
        });

        if (!entity) {
            throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'));
        }

        const updatedEntity = await this.userRepository.save({
            ...entity,
            ...payload,
            role: payload.roleId ? { id: payload.roleId } : entity.role,
        });

        return UserMapper.toDomain(updatedEntity);
    }

    async delete(id: User['id']): Promise<void> {
        await this.userRepository.softDelete({ id });
    }
}

