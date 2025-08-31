import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IntroductionService } from './introduction.service';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { UpdateIntroductionDto } from './dto/update-introduction.dto';
import { FilterIntroductionDto, SortIntroductionDto } from './dto/query-introduction.dto';
import { Public } from '@/decorator/customize.decorator';

@Controller('introduction')
export class IntroductionController {
  constructor(private readonly introductionService: IntroductionService) { }

  @Post()
  create(@Body() createIntroductionDto: CreateIntroductionDto) {
    return this.introductionService.create(createIntroductionDto);
  }

  @Get()
  @Public()
  findAll(
    @Query() filterOptions: FilterIntroductionDto,
    @Query('sortOptions') sortOptions: SortIntroductionDto[] = [{ orderBy: 'createdAt', order: 'DESC' }],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.introductionService.findAll({
      filterOptions,
      sortOptions,
      paginationOptions: { page, limit }
    });
  }

  @Get('key/:key')
  @Public()
  findByKey(@Param('key') key: string) {
    return this.introductionService.findByKey(key);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.introductionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntroductionDto: UpdateIntroductionDto) {
    return this.introductionService.update(id, updateIntroductionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.introductionService.delete(id);
  }
}
