import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { User } from "@/modules/users/user.domain";
import { InjectRepository } from "@nestjs/typeorm";
import { UserMapper } from "./user.mapper";
import { NullableType } from "@/utils/types/nullable.type";
import { FilterUserDto, SortUserDto } from "./dto/query-user.dto";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) { }
    async create(data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<User> {
        const persistenceModel = UserMapper.toPersistence(data as User)
        const newEntity = await this.userRepository.save(
            this.userRepository.create(persistenceModel)
        )
        return UserMapper.toDomain(newEntity)
    }

    async findByEmail(email: User['email']): Promise<NullableType<User>> {
        if (!email) return null;

        const entity = await this.userRepository.findOne({
            where: { email },
        });

        return entity ? UserMapper.toDomain(entity) : null;
    }

    async findById(id: User['id']): Promise<NullableType<User>> {
        const entity = await this.userRepository.findOne({
            where: { id: Number(id) }
        })
        return entity ? UserMapper.toDomain(entity) : null
    }

    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }:
        { filterOptions?: FilterUserDto | null; sortOptions?: SortUserDto[] | null; paginationOptions: IPaginationOptions; })
        : Promise<PaginationResponseDto> {
        const where: FindOptionsWhere<UserEntity> = {};
        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }
        const [entities, total] = await this.userRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
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
            result: entities.map((user) => UserMapper.toDomain(user))
        }
    }

    async update(id: User['id'], payload: Omit<User, 'id' | 'password' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<User> {
        const entity = await this.userRepository.findOne({
            where: { id: Number(id) },
        });

        if (!entity) {
            throw new Error('User not found');
        }

        const updatedEntity = await this.userRepository.save(
            this.userRepository.create(
                UserMapper.toPersistence({
                    ...UserMapper.toDomain(entity),
                    ...payload,
                }),
            ),
        );

        return UserMapper.toDomain(updatedEntity);
    }

    async delete(id: User['id']): Promise<void> {
        await this.userRepository.softDelete(id);
    }
}