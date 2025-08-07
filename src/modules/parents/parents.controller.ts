import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { QueryDto } from 'utils/types/query.dto';
import { FilterParentDto, SortParentDto } from './parent.repository';
import { Parent } from './parent.domain';
import { addChildDto } from './dto/add-child.dto';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) { }

  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  findAll(@Query() query: QueryDto<FilterParentDto, SortParentDto>) {
    const page = query?.page;
    const limit = query?.limit;
    return this.parentsService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit
      }
    });
  }

  @Patch('add-child')
  addChild(@Body() addChildDto: addChildDto) {
    return this.parentsService.addChild(addChildDto.studentId, addChildDto.parentId);
  }

  @Patch('remove-child')
  removeChild(@Body() removeChildDto: addChildDto) {
    return this.parentsService.removeChild(removeChildDto.studentId, removeChildDto.parentId);
  }

  @Get(':id')
  findOne(@Param('id') id: Parent['id']) {
    return this.parentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(+id, updateParentDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.parentsService.delete(+id);
  }
}
