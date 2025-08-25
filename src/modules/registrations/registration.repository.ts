import { Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { Registration } from './registration.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrationEntity } from './entities/registration.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { RegistrationMapper } from './registration.mapper';
import { ClassEntity } from '../classes/entities/class.entity';
import { NullableType } from '@/utils/types/nullable.type';
@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectRepository(RegistrationEntity)
    private registrationRepository: Repository<RegistrationEntity>,
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
  ) { }
  async create(
    data: Omit<Registration, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Registration> {
    // Tìm class từ classId
    const classEntity = await this.classRepository.findOne({
      where: { id: data.class?.id },
    });

    if (!classEntity) {
      throw new Error('Class not found');
    }

    // Tạo domain với full class info
    const domainWithClass: Registration = {
      ...data,
      class: {
        id: classEntity.id,
        name: classEntity.name,
        grade: classEntity.grade,
        section: classEntity.section,
        year: classEntity.year,
        description: classEntity.description,
        feePerLesson: classEntity.feePerLesson,
        status: classEntity.status as 'active' | 'upcoming' | 'closed',
        max_student: classEntity.max_student,
        room: classEntity.room,
        schedule: classEntity.schedule,
      },
    } as Registration;

    const persistenceModel = RegistrationMapper.toPersistence(domainWithClass);
    const newEntity = await this.registrationRepository.save(
      this.registrationRepository.create(persistenceModel),
    );
    return RegistrationMapper.toDomain(newEntity);
  }
  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any;
    sortOptions?: any;
    paginationOptions?: IPaginationOptions;
  }): Promise<PaginationResponseDto<Registration>> {
    // logic to find all registrations
    const where: FindOptionsWhere<RegistrationEntity> = {};
    if (filterOptions?.email) {
      where.email = ILike(`%${filterOptions.email}%`);
    }
    if (filterOptions?.name) {
      where.name = ILike(`%${filterOptions.name}%`);
    }
    if (filterOptions?.processed) {
      where.processed = filterOptions.processed;
    }
    if (filterOptions?.class) {
      where.class = filterOptions.class;
    }
    const [entities, totalItems] =
      await this.registrationRepository.findAndCount({
        skip:
          ((paginationOptions?.page || 1) - 1) *
          (paginationOptions?.limit || 10),
        take: paginationOptions?.limit || 10,
        where: where,
        relations: ['class'],
        order: sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy]: sort.order,
          }),
          {},
        ),
      });
    const totalPages = Math.ceil(totalItems / (paginationOptions?.limit || 10));
    return {
      meta: {
        page: paginationOptions?.page || 1,
        limit: paginationOptions?.limit || 10,
        totalItems: totalItems,
        totalPages: totalPages,
      },
      result: entities.map((entity) => RegistrationMapper.toDomain(entity)),
    };
  }

  async findAll(): Promise<Registration[]> {
    const entities = await this.registrationRepository.find({
      relations: ['class'],
    });
    return entities.map((entity) => RegistrationMapper.toDomain(entity));
  }

  async findById(id: Registration['id']): Promise<NullableType<Registration>> {
    const entity = await this.registrationRepository.findOne({
      where: { id },
      relations: ['class'],
    });
    return entity ? RegistrationMapper.toDomain(entity) : null;
  }

  async update(
    id: Registration['id'],
    data: Partial<
      Omit<Registration, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ) {
    const existingEntity = await this.registrationRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    // Convert domain data to persistence format if needed
    const updateData = {
      ...existingEntity,
      ...data,
      // Handle class relationship properly if classId is provided
      ...(data.class?.id && { classId: data.class.id }),
    };

    // Save the updated entity
    await this.registrationRepository.save(updateData);

    // Fetch the updated entity with relations to ensure we have fresh data
    const updatedEntity = await this.registrationRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    return RegistrationMapper.toDomain(updatedEntity);
  }

  async remove(id: Registration['id']): Promise<void> {
    await this.registrationRepository.softDelete({ id });
  }
}
