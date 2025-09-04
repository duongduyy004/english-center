import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleRepository } from './article.repository';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterArticleDto, SortArticleDto } from './dto/query-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly articleRepository: ArticleRepository,
  ) { }

  async create(createArticleDto: CreateArticleDto) {
    return this.articleRepository.create(createArticleDto);
  }

  async findAll(query: QueryDto<FilterArticleDto, SortArticleDto>) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    return this.articleRepository.findManyWithPagination({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: { page, limit },
    });
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findById(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository.update(id, updateArticleDto);
  }

  async remove(id: string) {
    await this.articleRepository.remove(id);
    return { message: 'Article deleted successfully' };
  }
}
