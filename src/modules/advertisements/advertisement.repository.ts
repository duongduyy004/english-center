import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { AdvertisementEntity } from "./entities/advertisement.entity";
import { Injectable } from "@nestjs/common";
import { Advertisement } from "./advertisement.domain";
import { InjectRepository } from "@nestjs/typeorm";
import { AdvertisementMapper } from "./advertisement.mapper";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";

@Injectable()
export class AdvertisementRepository {
    constructor(
        @InjectRepository(AdvertisementEntity) private advertisementRepository: Repository<AdvertisementEntity>
    ) { }

    async create(data: Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<Advertisement> {
        const persistenceModel = AdvertisementMapper.toPersistence(data as Advertisement);
        const newEntity = await this.advertisementRepository.save(
            this.advertisementRepository.create(persistenceModel)
        );
        return AdvertisementMapper.toDomain(newEntity);
    }

    async findById(id: Advertisement['id']): Promise<NullableType<Advertisement>> {
        const entity = await this.advertisementRepository.findOne({
            where: { id },
            relations: ['class']
        });
        return entity ? AdvertisementMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: any | null;
        sortOptions?: any[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Advertisement>> {
        const where: FindOptionsWhere<AdvertisementEntity> = {};

        if (filterOptions?.title) {
            where.title = ILike(filterOptions.title);
        }

        if (filterOptions?.type) {
            where.type = filterOptions.type;
        }

        const [entities, total] = await this.advertisementRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            relations: ['class'],
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
            result: entities ? entities.map((advertisement) => AdvertisementMapper.toDomain(advertisement)) : null
        };
    }

    async update(id: Advertisement['id'], payload: Partial<Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<Advertisement> {
        const entity = await this.advertisementRepository.findOne({
            where: { id }
        });

        if (!entity) {
            throw new Error('Advertisement not found');
        }

        await this.advertisementRepository.save({ ...entity, ...payload });

        const updatedEntity = await this.advertisementRepository.findOne({
            where: { id }
        });

        return AdvertisementMapper.toDomain(updatedEntity!);
    }

    async delete(id: Advertisement['id']): Promise<void> {
        await this.advertisementRepository.softRemove({ id });
    }

    async getLimitBanners(limit: number) {
        const entities = await this.advertisementRepository.find({
            where: { type: 'banner' },
            take: limit,
            order: { 'priority': "ASC" }
        })

        return entities ? entities.map((advertisement) => AdvertisementMapper.toDomain(advertisement)) : null;
    }

    async getHighestPriorityPopup() {
        const entity = await this.advertisementRepository.findOne({
            where: { type: 'popup' },
            order: { 'priority': "ASC" }
        })

        return AdvertisementMapper.toDomain(entity)
    }
}