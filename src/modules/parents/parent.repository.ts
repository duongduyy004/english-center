import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NullableType } from "utils/types/nullable.type";
import { IPaginationOptions } from "utils/types/pagination-options";
import { PaginationResponseDto } from "utils/types/pagination-response.dto";
import { ParentEntity } from "./entities/parent.entity";
import { Parent } from "./parent.domain";
import { ParentMapper } from "./parent.mapper";
import { Student } from "modules/students/student.domain";
import { StudentMapper } from "modules/students/student.mapper";
import { RoleEnum } from "modules/roles/roles.enum";

export class FilterParentDto {
    name?: string;
    email?: string;
    status?: string;
}

export class SortParentDto {
    orderBy: keyof Parent;
    order: 'ASC' | 'DESC';
}

@Injectable()
export class ParentRepository {
    constructor(
        @InjectRepository(ParentEntity) private parentRepository: Repository<ParentEntity>
    ) { }

    async create(data: Omit<Parent, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'students'>): Promise<Parent> {
        const persistenceModel = ParentMapper.toPersistence({ ...data, role: { id: RoleEnum.parent } } as Parent)
        const newEntity = await this.parentRepository.save(
            this.parentRepository.create(persistenceModel)
        )
        return ParentMapper.toDomain(newEntity)
    }

    async findByEmail(email: Parent['email']): Promise<NullableType<Parent>> {
        if (!email) return null;

        const entity = await this.parentRepository.findOne({
            where: { email }
        });

        return entity ? ParentMapper.toDomain(entity) : null;
    }

    async findById(id: Parent['id']): Promise<NullableType<Parent>> {
        const entity = await this.parentRepository.findOne({
            where: { id },
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

        const [entities, total] = await this.parentRepository.findAndCount({
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
        const entity = await this.parentRepository.findOne({
            where: { id },
            relations: ['students', 'role']
        });

        if (!entity) {
            throw new Error('Parent not found');
        }

        const newEntity = await this.parentRepository.save({ ...entity, ...payload, role: { id: entity.role.id } })
        return ParentMapper.toDomain(newEntity);
    }

    async delete(id: Parent['id']): Promise<void> {
        await this.parentRepository.softRemove({ id });
    }

    async addChild(student: Student, parentId: Parent['id']) {
        const parentEntity = await this.parentRepository.findOne({
            where: { id: parentId },
            relations: ['students']
        })

        for (const studentExist of parentEntity.students) {
            if (studentExist.id === student.id) {
                return null
            }
        }

        parentEntity.students.push(StudentMapper.toPersistence(student))
        await this.parentRepository.save(parentEntity)

        return parentEntity;
    }

    async removeChild(studentId: Student['id'], parentId: Parent['id']) {
        const parentEntity = await this.parentRepository.findOne({
            where: { id: parentId },
            relations: ['students']
        })

        parentEntity.students = parentEntity.students.filter(item => item.id.toString() !== studentId.toString())
        await this.parentRepository.save(parentEntity)
        return parentEntity
    }
}