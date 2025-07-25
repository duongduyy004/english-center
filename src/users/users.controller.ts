import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { QueryUserDto } from '@/users/dto/query-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  @ResponseMessage('user.SUCCESS.CREATE_A_USER')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ResponseMessage('user.SUCCESS.GET_USER_PAGINATION')
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    const page = query?.page;
    const limit = query?.limit;
    console.log('check filter', query)
    return this.usersService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit
      }
    });
  }

  @ResponseMessage('user.SUCCESS.GET_A_USER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ResponseMessage('user.SUCCESS.UPDATE_A_USER')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ResponseMessage('user.SUCCESS.DELETE_A_USER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }
}
