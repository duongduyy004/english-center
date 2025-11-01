import { Between, FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { StudentEntity } from './entities/student.entity';
import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Student } from './student.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentMapper } from './student.mapper';
import { NullableType } from 'utils/types/nullable.type';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { FilterStudentDto, SortStudentDto } from './dto/query-student.dto';
import { RoleEnum } from 'modules/roles/roles.enum';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
  ) {}

  async create(
    data: Omit<
      Student,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'classes'
    >,
  ): Promise<Student> {
    const persistenceModel = StudentMapper.toPersistence({
      ...data,
      role: { id: RoleEnum.student },
    } as Student);
    const newEntity = await this.studentRepository.save(
      this.studentRepository.create(persistenceModel),
    );
    return StudentMapper.toDomain(newEntity);
  }

  async findByEmail(email: Student['email']): Promise<NullableType<Student>> {
    if (!email) return null;

    const entity = await this.studentRepository.findOne({
      where: { email },
      relations: ['parent', 'classes', 'classes.class'],
    });

    return entity ? StudentMapper.toDomain(entity) : null;
  }

  async findById(id: Student['id']): Promise<NullableType<Student>> {
    const entity = await this.studentRepository.findOne({
      where: { id },
      relations: ['parent', 'classes.class'],
    });
    return entity ? StudentMapper.toDomain(entity) : null;
  }

  async findStudents(ids: Student['id'][]) {
    const entities = await this.studentRepository.find({
      where: { id: In([...ids]) },
      relations: ['classes.class'],
    });
    return entities
      ? entities.map((item) => StudentMapper.toDomain(item))
      : null;
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
      relations: ['parent', 'classes.class'],
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
      result: entities.map((student) => StudentMapper.toDomain(student)),
    };
  }

  async update(
    id: Student['id'],
    payload: Partial<
      Omit<
        Student,
        'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'classes'
      >
    >,
  ): Promise<Student> {
    const entity = await this.studentRepository.findOne({
      where: { id },
      relations: ['parent', 'classes', 'classes.class'],
    });

    if (!entity) {
      throw new Error('Student not found');
    }

    await this.studentRepository.save({
      ...entity,
      ...payload,
      role: { id: entity.role.id },
    });

    return StudentMapper.toDomain(entity);
  }

  async delete(id: Student['id']): Promise<void> {
    await this.studentRepository.softRemove({ id });
  }

  async getSchedule(id: Student['id']) {
    const entity = await this.studentRepository.findOne({
      where: { id },
      relations: ['classes.class'],
    });
    return StudentMapper.toDomain(entity).classes;
  }

  async getStatistics() {
    const totalStudents = await this.studentRepository.count();
    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();
    // Use UTC boundaries to avoid timezone shifts when comparing timestamps
    const startOfMonth = new Date(
      Date.UTC(currentYear, currentMonth, 1, 0, 0, 0),
    );
    const endOfMonth = new Date(
      Date.UTC(currentYear, currentMonth + 1, 1, 0, 0, 0),
    );
    const increaseStudentsInMonth = await this.studentRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
      withDeleted: true,
    });
    const decreaseStudentsInMonth = await this.studentRepository.count({
      where: {
        deletedAt: Between(startOfMonth, endOfMonth),
      },
      withDeleted: true,
    });
    return {
      totalStudents,
      currentMonth,
      currentYear,
      startOfMonth,
      endOfMonth,
      increaseStudentsInMonth,
      decreaseStudentsInMonth,
    };
  }
}
