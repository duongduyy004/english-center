import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterArticleDto, SortArticleDto } from './dto/query-article.dto';
import { Roles } from '@/decorator/customize.decorator';
import { RoleEnum } from '@/modules/roles/roles.enum';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @Roles(RoleEnum.admin)
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @Roles(RoleEnum.admin)
  findAll(@Query() query: QueryDto<FilterArticleDto, SortArticleDto>) {
    return this.articlesService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleEnum.admin)
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.admin)
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
