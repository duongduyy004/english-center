import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { TeacherEntity } from './entities/teacher.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Teacher } from './teacher.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherMapper } from './teacher.mapper';
import { NullableType } from 'utils/types/nullable.type';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { RoleEnum } from '../roles/roles.enum';
import { OmitType } from '@nestjs/mapped-types';
import { filter } from 'lodash';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

export class FilterTeacherDto {
  name?: string;
  email?: string;
  isActive?: boolean;
}

export class SortTeacherDto {
  orderBy: keyof Teacher;
  order: 'ASC' | 'DESC';
}

@Injectable()
export class TeacherRepository {
  constructor(
    @InjectRepository(TeacherEntity)
    private teacherRepository: Repository<TeacherEntity>,
  ) { }

  async create(
    data: Omit<
      Teacher,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'classes' | 'typical'
    >,
  ): Promise<Teacher> {
    const persistenceModel = TeacherMapper.toPersistence({
      ...data,
      role: { id: RoleEnum.teacher },
    } as Teacher);
    const newEntity = await this.teacherRepository.save(
      this.teacherRepository.create(persistenceModel),
    );
    return TeacherMapper.toDomain(newEntity);
  }

  async findByEmail(email: Teacher['email']): Promise<NullableType<Teacher>> {
    if (!email) return null;

    const entity = await this.teacherRepository.findOne({
      where: { email },
    });

    return entity ? TeacherMapper.toDomain(entity) : null;
  }

  async findById(id: Teacher['id']): Promise<NullableType<Teacher>> {
    const entity = await this.teacherRepository.findOne({
      where: { id },
      relations: ['classes'],
    });
    return entity ? TeacherMapper.toDomain(entity) : null;
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTeacherDto | null;
    sortOptions?: SortTeacherDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Teacher>> {
    const where: FindOptionsWhere<TeacherEntity> = {};

    if (filterOptions?.name) {
      where.name = ILike(`%${filterOptions.name}%`);
    }

    if (filterOptions?.email) {
      where.email = ILike(`%${filterOptions.email}%`);
    }

    if (filterOptions?.isActive !== undefined) {
      where.isActive = filterOptions.isActive;
    }
    const [entities, total] = await this.teacherRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['classes'],
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
      result: entities.map((teacher) => TeacherMapper.toDomain(teacher)),
    };
  }

  async update(
    id: Teacher['id'],
    payload: UpdateTeacherDto
  ): Promise<Teacher> {
    const entity = await this.teacherRepository.findOne({
      where: { id },
    });

    const newEntity = await this.teacherRepository.save({
      ...entity,
      ...payload,
      role: { id: entity.role.id },
    });

    return TeacherMapper.toDomain(newEntity);
  }

  async delete(id: Teacher['id']): Promise<void> {
    await this.teacherRepository.softRemove({ id });
  }

  async getSchedule(id: Teacher['id']) {
    const entity = await this.teacherRepository.findOne({
      where: { id },
      relations: ['classes'],
    });

    return TeacherMapper.toDomain(entity).classes;
  }

  async getTypicalTeachers() {
    const entities = await this.teacherRepository.find({
      where: { typical: true },
      order: { createdAt: 'ASC' },
    });

    return entities
      ? entities.map((item) => TeacherMapper.toDomain(item))
      : null;
  }

  async getTypicalTeacherDetail(id: Teacher['id']) {
    const entity = await this.teacherRepository.findOne({
      where: { id, typical: true },
    });
    if (!entity) throw new BadRequestException('Not found teacher');
    return TeacherMapper.toDomain(entity);
  }
}
