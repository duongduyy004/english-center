import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { QueryDto } from 'utils/types/query.dto';
import { FilterParentDto, SortParentDto } from './parent.repository';
import { Parent } from './parent.domain';
import { addChildDto } from './dto/add-child.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @ResponseMessage('parent.SUCCESS.CREATE_A_PARENT')
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  @ResponseMessage('parent.SUCCESS.GET_PARENT_PAGINATION')
  findAll(@Query() query: QueryDto<FilterParentDto, SortParentDto>) {
    const page = query?.page;
    const limit = query?.limit;
    return this.parentsService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @Patch('add-child')
  @ResponseMessage('parent.SUCCESS.ADD_CHILD')
  addChild(@Body() addChildDto: addChildDto) {
    return this.parentsService.addChild(
      addChildDto.studentId,
      addChildDto.parentId,
    );
  }

  @Patch('remove-child')
  @ResponseMessage('parent.SUCCESS.REMOVE_CHILD')
  removeChild(@Body() removeChildDto: addChildDto) {
    return this.parentsService.removeChild(
      removeChildDto.studentId,
      removeChildDto.parentId,
    );
  }

  @Get(':id')
  @ResponseMessage('parent.SUCCESS.GET_A_PARENT')
  findOne(@Param('id') id: Parent['id']) {
    return this.parentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('parent.SUCCESS.UPDATE_A_PARENT')
  update(
    @Param('id') id: Parent['id'],
    @Body() updateParentDto: UpdateParentDto,
  ) {
    return this.parentsService.update(id, updateParentDto);
  }

  @Delete(':id')
  @ResponseMessage('parent.SUCCESS.DELETE_A_PARENT')
  delete(@Param('id') id: Parent['id']) {
    return this.parentsService.delete(id);
  }
}
