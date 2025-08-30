import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { FeedbackEntity } from './entities/feedback.entity';
import { Feedback } from './feedback.domain';
import { FeedbackMapper } from './feedback.mapper';
import { NullableType } from '@/utils/types/nullable.type';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { FilterFeedbackDto, SortFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackRepository {
    constructor(
        @InjectRepository(FeedbackEntity) private feedbackRepository: Repository<FeedbackEntity>
    ) { }

    async create(data: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Feedback> {
        const persistenceModel = FeedbackMapper.toPersistence(data as Feedback);
        const newEntity = await this.feedbackRepository.save(
            this.feedbackRepository.create(persistenceModel)
        );
        return FeedbackMapper.toDomain(newEntity);
    }

    async findById(id: Feedback['id']): Promise<NullableType<Feedback>> {
        const entity = await this.feedbackRepository.findOne({
            where: { id }
        });
        return entity ? FeedbackMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterFeedbackDto | null;
        sortOptions?: SortFeedbackDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Feedback>> {
        const where: FindOptionsWhere<FeedbackEntity> = {};

        if (filterOptions?.name) {
            where.name = ILike(`%${filterOptions.name}%`);
        }

        const [entities, total] = await this.feedbackRepository.findAndCount({
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
            result: entities.map((feedback) => FeedbackMapper.toDomain(feedback))
        };
    }

    async update(id: Feedback['id'], payload: Partial<Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Feedback> {
        const entity = await this.feedbackRepository.findOne({
            where: { id }
        });

        if (!entity) {
            throw new Error('Feedback not found');
        }

        await this.feedbackRepository.save({ ...entity, ...payload });

        const updatedEntity = await this.feedbackRepository.findOne({
            where: { id }
        });

        return FeedbackMapper.toDomain(updatedEntity!);
    }

    async delete(id: Feedback['id']): Promise<void> {
        await this.feedbackRepository.softRemove({ id });
    }
}
