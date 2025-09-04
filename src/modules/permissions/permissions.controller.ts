import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Roles } from '@/decorator/customize.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterPermissionDto, SortPermissionDto } from './dto/query-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @Roles(RoleEnum.admin)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Roles(RoleEnum.admin)
  findAll(@Query() query: QueryDto<FilterPermissionDto, SortPermissionDto>) {
    const page = query?.page;
    const limit = query?.limit;
    return this.permissionsService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit
      }
    });
  }

  @Get(':id')
  @Roles(RoleEnum.admin)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.admin)
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
