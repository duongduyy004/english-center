import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Roles } from '@/decorator/customize.decorator';
import { RoleEnum } from './roles.enum';
import { RemovePermissionsDto } from './dto/remove-permissions.dto';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterRoleDto, SortRoleDto } from './dto/query-role.dto';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Patch('assign-permissions')
    @Roles(RoleEnum.admin)
    assignPermissions(@Body() dto: AssignPermissionsDto) {
        return this.rolesService.assignPermissions(dto);
    }

    @Patch('remove-permissions')
    @Roles(RoleEnum.admin)
    removePermissions(@Body() dto: RemovePermissionsDto) {
        return this.rolesService.removePermissions(dto);
    }

    @Get()
    @Roles(RoleEnum.admin)
    findAll(@Query() query: QueryDto<FilterRoleDto, SortRoleDto>) {
        return this.rolesService.findAll(query);
    }
}
