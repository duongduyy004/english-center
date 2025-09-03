import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto, SortTeacherDto } from './teacher.repository';
import { QueryDto } from 'utils/types/query.dto';
import { Teacher } from './teacher.domain';
import { Public } from '@/decorator/customize.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  findAll(@Query() query: QueryDto<FilterTeacherDto, SortTeacherDto>) {
    const page = query?.page;
    const limit = query?.limit;
    return this.teachersService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit
      }
    });
  }

  @Get('typical')
  @Public()
  getTypicalTeachers() {
    return this.teachersService.getTypicalTeachers();
  }
  @Get('typical/:id')
  @Public()
  getTypicalTeacherDetail(@Param('id') id: string) {
    return this.teachersService.getTypicalTeacherDetail(id);
  }

  @Get('/schedule/:id')
  getSchedule(@Param('id') id: Teacher['id']) {
    return this.teachersService.getSchedule(id);
  }

  @Get(':id')
  findOne(@Param('id') id: Teacher['id']) {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Teacher['id'], @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  delete(@Param('id') id: Teacher['id']) {
    return this.teachersService.delete(id);
  }
}
