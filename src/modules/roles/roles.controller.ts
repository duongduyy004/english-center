import { Body, Controller, Get, Patch, Query, Post, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Roles } from '@/decorator/customize.decorator';
import { RoleEnum } from './roles.enum';
import { RemovePermissionsDto } from './dto/remove-permissions.dto';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @Roles(RoleEnum.admin)
    findAll(@Query() query: QueryDto<FilterRoleDto, SortRoleDto>) {
        return this.rolesService.findAll(query);
    }

    @Post()
    @Roles(RoleEnum.admin)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get(':id')
    @Roles(RoleEnum.admin)
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @Patch(':id')
    @Roles(RoleEnum.admin)
    update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rolesService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    @Roles(RoleEnum.admin)
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }
}
