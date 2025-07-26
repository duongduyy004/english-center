import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";
import { ParentEntity } from "./entities/parent.entity";
import { Parent } from "./parent.domain";
import { ParentMapper } from "./parent.mapper";
import { StudentEntity } from "../students/entities/student.entity";

export interface FilterParentDto {
    name?: string;
    email?: string;
    status?: string;
}

export interface SortParentDto {
    orderBy: keyof Parent;
    order: 'ASC' | 'DESC';
}

@Injectable()
export class ParentRepository {
    constructor(
        @InjectRepository(ParentEntity) private studentRepository: Repository<ParentEntity>
    ) { }

    async create(data: Omit<Parent, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'students'>): Promise<Parent> {
        const persistenceModel = ParentMapper.toPersistence(data as Parent)
        const newEntity = await this.studentRepository.save(
            this.studentRepository.create(persistenceModel)
        )
        return ParentMapper.toDomain(newEntity)
    }

    async findByEmail(email: Parent['email']): Promise<NullableType<Parent>> {
        if (!email) return null;

        const entity = await this.studentRepository.findOne({
            where: { email }
        });

        return entity ? ParentMapper.toDomain(entity) : null;
    }

    async findById(id: Parent['id']): Promise<NullableType<Parent>> {
        const entity = await this.studentRepository.findOne({
            where: { id: Number(id) },
            relations: ['students']
        })
        return entity ? ParentMapper.toDomain(entity) : null
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterParentDto | null;
        sortOptions?: SortParentDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Parent>> {
        const where: FindOptionsWhere<ParentEntity> = {};

        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.email) {
            where.email = ILike(`%${filterOptions.email}%`);
        }

        const [entities, total] = await this.studentRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: ['students'],
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
            result: entities.map((student) => ParentMapper.toDomain(student))
        }
    }

    async update(id: Parent['id'], payload: Partial<Omit<Parent, 'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Parent> {
        const entity = await this.studentRepository.findOne({
            where: { id: Number(id) },
            relations: ['students']
        });

        if (!entity) {
            throw new Error('Parent not found');
        }

        const updatedEntity = await this.studentRepository.save(
            this.studentRepository.create(
                ParentMapper.toPersistence({
                    ...ParentMapper.toDomain(entity),
                    ...payload,
                } as Parent),
            ),
        );

        return ParentMapper.toDomain(updatedEntity);
    }

    async delete(id: Parent['id']): Promise<void> {
        await this.studentRepository.softDelete(id);
    }
}