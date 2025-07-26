import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository, ILike } from "typeorm";
import { ClassEntity } from "./entities/class.entity";
import { Class } from "./class.domain";
import { ClassMapper } from "./class.mapper";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { FilterClassDto, SortClassDto } from "./dto/query-class.dto";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";



@Injectable()
export class ClassRepository {
    constructor(
        @InjectRepository(ClassEntity) private classRepository: Repository<ClassEntity>
    ) { }

    async create(data: Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Class> {
        const persistenceModel = ClassMapper.toPersistence(data as Class);
        const newEntity = await this.classRepository.save(
            this.classRepository.create(persistenceModel)
        );
        return ClassMapper.toDomain(newEntity);
    }

    async findAll(): Promise<Class[]> {
        const entities = await this.classRepository.find({
            relations: ['class_student']
        });
        return entities.map(entity => ClassMapper.toDomain(entity));
    }

    async findById(id: number): Promise<NullableType<Class>> {
        const entity = await this.classRepository.findOne({
            where: { id },
            relations: ['class_student']
        });
        return entity ? ClassMapper.toDomain(entity) : null;
    }

    async update(id: number, data: Partial<Omit<Class, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Class> {
        await this.classRepository.update(id, data);
        const updatedEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['class_student']
        });
        return ClassMapper.toDomain(updatedEntity);
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterClassDto | null;
        sortOptions?: SortClassDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Class>> {
        const where: FindOptionsWhere<ClassEntity> = {};

        // Apply filters
        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        if (filterOptions?.grade) {
            where.grade = filterOptions.grade;
        }

        if (filterOptions?.section) {
            where.section = filterOptions.section;
        }

        if (filterOptions?.year) {
            where.year = filterOptions.year;
        }

        if (filterOptions?.status) {
            where.status = filterOptions.status;
        }

        if (filterOptions?.room) {
            where.room = ILike(`%${filterOptions.room}%`);
        }

        const [entities, total] = await this.classRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: ['class_student'],
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
            result: entities.map((classEntity) => ClassMapper.toDomain(classEntity))
        }
    }
}