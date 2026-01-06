import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { Injectable } from '@nestjs/common';
import { Notification } from './notification.domain';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationMapper } from './notification.mapper';
import { NullableType } from 'utils/types/nullable.type';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import {
    FilterNotificationDto,
    SortNotificationDto,
} from './dto/query-notification.dto';

@Injectable()
export class NotificationRepository {
    constructor(
        @InjectRepository(NotificationEntity)
        private notificationRepository: Repository<NotificationEntity>,
    ) { }

    async findById(
        id: Notification['id'],
    ): Promise<NullableType<Notification>> {
        const entity = await this.notificationRepository.findOne({
            where: { id },
            relations: ['object'],
        });
        return entity ? NotificationMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterNotificationDto | null;
        sortOptions?: SortNotificationDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Notification>> {
        const where: FindOptionsWhere<NotificationEntity> = {};

        if (filterOptions?.recipientId) {
            where.recipientId = filterOptions.recipientId;
        }

        if (filterOptions?.isRead !== undefined) {
            where.isRead = filterOptions.isRead;
        }

        const [entities, total] = await this.notificationRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where: where,
            relations: ['object'],
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
            result: entities.map(NotificationMapper.toDomain)
        };
    }

    async markAsRead(
        id: Notification['id'],
        recipientId: string,
    ): Promise<NullableType<Notification>> {
        const entity = await this.notificationRepository.findOne({
            where: { id, recipientId },
            relations: ['object'],
        });

        if (!entity) {
            return null;
        }

        entity.isRead = true;
        const updatedEntity = await this.notificationRepository.save(entity);
        return NotificationMapper.toDomain(updatedEntity);
    }
}
