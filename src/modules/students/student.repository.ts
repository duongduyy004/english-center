import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { StudentEntity } from "./entities/student.entity";
import { Injectable } from "@nestjs/common";
import { Student } from "./student.domain";
import { InjectRepository } from "@nestjs/typeorm";
import { StudentMapper } from "./student.mapper";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";

export interface FilterStudentDto {
    name?: string;
    email?: string;
    status?: string;
}

export interface SortStudentDto {
    orderBy: keyof Student;
    order: 'ASC' | 'DESC';
}

@Injectable()
export class StudentRepository {
    constructor(
        @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>
    ) { }

    async create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Student> {
        const persistenceModel = StudentMapper.toPersistence(data as Student)
        const newEntity = await this.studentRepository.save(
            this.studentRepository.create(persistenceModel)
        )
        return StudentMapper.toDomain(newEntity)
    }

    async findByEmail(email: Student['email']): Promise<NullableType<Student>> {
        if (!email) return null;

        const entity = await this.studentRepository.findOne({
            where: { email },
            relations: ['parent', 'class_student', 'class_student.class']
        });

        return entity ? StudentMapper.toDomain(entity) : null;
    }

    async findById(id: Student['id']): Promise<NullableType<Student>> {
        const entity = await this.studentRepository.findOne({
            where: { id: Number(id) },
            relations: ['parent', 'class_student', 'class_student.class']
        })
        return entity ? StudentMapper.toDomain(entity) : null
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterStudentDto | null;
        sortOptions?: SortStudentDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Student>> {
        const where: FindOptionsWhere<StudentEntity> = {};

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
            relations: ['parent', 'class_student', 'class_student.class'],
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
            result: entities.map((student) => StudentMapper.toDomain(student))
        }
    }

    async update(id: Student['id'], payload: Partial<Omit<Student, 'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Student> {
        const entity = await this.studentRepository.findOne({
            where: { id: Number(id) },
            relations: ['parent', 'class_student', 'class_student.class']
        });

        if (!entity) {
            throw new Error('Student not found');
        }

        const updatedEntity = await this.studentRepository.save(
            this.studentRepository.create(
                StudentMapper.toPersistence({
                    ...StudentMapper.toDomain(entity),
                    ...payload,
                } as Student),
            ),
        );

        return StudentMapper.toDomain(updatedEntity);
    }

    async delete(id: Student['id']): Promise<void> {
        await this.studentRepository.softDelete(id);
    }

    async findByParentId(parentId: number): Promise<Student[]> {
        const entities = await this.studentRepository.find({
            where: { parent: { id: parentId } },
            relations: ['parent', 'class_student', 'class_student.class']
        });

        return entities.map(entity => StudentMapper.toDomain(entity));
    }

    async findByClassId(classId: number): Promise<Student[]> {
        const entities = await this.studentRepository.find({
            where: { class_student: { class: { id: classId } } },
            relations: ['parent', 'class_student', 'class_student.class']
        });

        return entities.map(entity => StudentMapper.toDomain(entity));
    }
}