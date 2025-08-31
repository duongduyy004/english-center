import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { IntroductionEntity } from './entities/introduction.entity';
import { Introduction } from './introduction.domain';
import { IntroductionMapper } from './introduction.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { FilterIntroductionDto, SortIntroductionDto } from './dto/query-introduction.dto';

@Injectable()
export class IntroductionRepository {
    constructor(
        @InjectRepository(IntroductionEntity) private introductionRepository: Repository<IntroductionEntity>
    ) { }

    async create(data: Omit<Introduction, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Introduction> {
        const persistenceModel = IntroductionMapper.toPersistence(data as Introduction);
        const newEntity = await this.introductionRepository.save(
            this.introductionRepository.create(persistenceModel)
        );
        return IntroductionMapper.toDomain(newEntity);
    }

    async findById(id: Introduction['id']): Promise<NullableType<Introduction>> {
        const entity = await this.introductionRepository.findOne({
            where: { id }
        });
        return entity ? IntroductionMapper.toDomain(entity) : null;
    }

    async findByKey(key: Introduction['key']): Promise<NullableType<Introduction>> {
        const entity = await this.introductionRepository.findOne({
            where: { key }
        });
        return entity ? IntroductionMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterIntroductionDto | null;
        sortOptions?: SortIntroductionDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Introduction>> {
        const where: FindOptionsWhere<IntroductionEntity> = {};

        if (filterOptions?.key) {
            where.key = ILike(`%${filterOptions.key}%`);
        }

        if (filterOptions?.value) {
            where.value = ILike(`%${filterOptions.value}%`);
        }

        const [entities, total] = await this.introductionRepository.findAndCount({
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
        const totalPages = Math.ceil(totalItems / paginationOptions.limit);

        return {
            meta: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
                totalPages,
                totalItems
            },
            result: entities.map((introduction) => IntroductionMapper.toDomain(introduction))
        };
    }

    async update(id: Introduction['id'], payload: Partial<Omit<Introduction, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Introduction> {
        const entity = await this.introductionRepository.findOne({
            where: { id }
        });

        if (!entity) {
            throw new Error('Introduction not found');
        }

        await this.introductionRepository.save({ ...entity, ...payload });

        const updatedEntity = await this.introductionRepository.findOne({
            where: { id }
        });

        return IntroductionMapper.toDomain(updatedEntity!);
    }

    async delete(id: Introduction['id']): Promise<void> {
        await this.introductionRepository.softRemove({ id });
    }
}
