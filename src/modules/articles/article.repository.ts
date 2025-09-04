import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, ILike } from 'typeorm';
import { ArticleEnity } from './entities/article.entity';
import { Article } from './article.domain';
import { ArticleMapper } from './article.mapper';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FilterArticleDto, SortArticleDto } from './dto/query-article.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class ArticleRepository {
    constructor(
        @InjectRepository(ArticleEnity)
        private articleRepository: Repository<ArticleEnity>,
    ) { }

    async create(data: CreateArticleDto): Promise<Article> {
        const persistenceModel = this.articleRepository.create(data);
        const newEntity = await this.articleRepository.save(persistenceModel);
        return ArticleMapper.toDomain(newEntity);
    }

    async findById(id: Article['id']): Promise<NullableType<Article>> {
        const entity = await this.articleRepository.findOne({
            where: { id },
            relations: ['menu'],
        });

        return entity ? ArticleMapper.toDomain(entity) : null;
    }

    async findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterArticleDto | null;
        sortOptions?: SortArticleDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Article>> {
        const where: FindOptionsWhere<ArticleEnity> = {};

        if (filterOptions?.title) {
            where.title = ILike(`%${filterOptions.title}%`);
        }

        if (filterOptions?.content) {
            where.content = ILike(`%${filterOptions.content}%`);
        }

        if (filterOptions?.menuId) {
            where.menuId = filterOptions.menuId;
        }

        const [entities, total] = await this.articleRepository.findAndCount({
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            where,
            relations: ['menu'],
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
            result: entities.map((item) => ArticleMapper.toDomain(item)),
        };
    }

    async update(
        id: Article['id'],
        payload: UpdateArticleDto,
    ): Promise<Article> {
        const entity = await this.articleRepository.findOne({
            where: { id },
        });

        if (!entity) {
            throw new Error('Article not found');
        }

        const updatedEntity = await this.articleRepository.save(
            this.articleRepository.create({
                ...entity,
                ...payload,
            }),
        );

        return ArticleMapper.toDomain(updatedEntity);
    }

    async remove(id: Article['id']): Promise<void> {
        await this.articleRepository.delete(id);
    }
}
