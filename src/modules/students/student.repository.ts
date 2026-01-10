import { Between, FindOptionsWhere, ILike, In, LessThanOrEqual, Repository } from 'typeorm';
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
  ) { }

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
      relations: ['parent', 'classes.class.teacher'],
    });
    return entity ? StudentMapper.toDomain(entity) : null;
  }

  async findStudents(ids: Student['id'][]) {
    const entities = await this.studentRepository.find({
      where: { id: In([...ids]) },
      relations: ['classes.class', 'parent'],
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

    const newEntity = await this.studentRepository.save({
      ...entity,
      ...payload,
      role: { id: entity.role.id },
    });

    return StudentMapper.toDomain(newEntity);
  }

  async delete(id: Student['id']): Promise<void> {
    await this.studentRepository.softRemove({ id });
  }

  async getSchedule(id: Student['id']) {
    const entity = await this.studentRepository.findOne({
      where: { id },
      relations: ['classes.class.teacher'],
    });
    return StudentMapper.toDomain(entity).classes;
  }

  async getStatistics(year?: number) {
    const now = new Date();
    const selectedYear = year || now.getUTCFullYear();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1;

    const monthlyStats = [];

    for (let month = 1; month <= 12; month++) {
      const startOfMonth = new Date(
        Date.UTC(selectedYear, month - 1, 1, 0, 0, 0),
      );
      const endOfMonth = new Date(
        Date.UTC(selectedYear, month, 1, 0, 0, 0),
      );

      const increaseStudents = await this.studentRepository.count({
        where: {
          createdAt: Between(startOfMonth, endOfMonth),
        },
        withDeleted: true,
      });

      const decreaseStudents = await this.studentRepository.count({
        where: {
          deletedAt: Between(startOfMonth, endOfMonth),
        },
        withDeleted: true,
      });

      monthlyStats.push({
        month,
        year: selectedYear,
        increaseStudents,
        decreaseStudents,
        netChange: increaseStudents - decreaseStudents,
      });
    }

    const endOfYear = new Date(Date.UTC(selectedYear, 11, 31, 23, 59, 59, 999));
    const totalStudentsAtEndOfYear = await this.studentRepository.count({
      where: {
        createdAt: LessThanOrEqual(endOfYear),
      },
      withDeleted: false,
    });

    const totalIncrease = monthlyStats.reduce((sum, stat) => sum + stat.increaseStudents, 0);
    const totalDecrease = monthlyStats.reduce((sum, stat) => sum + stat.decreaseStudents, 0);
    const netChange = totalIncrease - totalDecrease;

    return {
      year: selectedYear,
      currentYear,
      currentMonth,
      totalStudentsAtEndOfYear,
      monthlyStats,
      summary: {
        totalIncrease,
        totalDecrease,
        netChange,
        period: {
          startDate: new Date(Date.UTC(selectedYear, 0, 1)).toISOString(),
          endDate: new Date(Date.UTC(selectedYear, 11, 31, 23, 59, 59, 999)).toISOString(),
        },
      },
    };
  }
}
