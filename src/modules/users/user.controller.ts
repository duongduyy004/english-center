import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { Auth, UserInfo } from "@/decorator/customize.decorator";
import { User } from "./user.domain";
import { UploadAvatarDto } from "./dto/upload-avatar.dto";
import { AssignRoleDto } from "./dto/assign-role.dto";
import { PushTokenDto } from "./dto/push-token.dto";
import { QueryDto } from "utils/types/query.dto";
import { FilterUserDto, SortUserDto } from "./dto/query-user.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
import { ResponseMessage } from "@/decorator/customize.decorator";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @ResponseMessage('user.SUCCESS.CREATE_A_USER')
    create(@Body() createStaffDto: CreateStaffDto) {
        return this.usersService.create(createStaffDto);
    }

    @Get()
    @ResponseMessage('user.SUCCESS.GET_USER_PAGINATION')
    findAll(@Query() query: QueryDto<FilterUserDto, SortUserDto>) {
        const page = query?.page;
        const limit = query?.limit;
        return this.usersService.findAll({
            filterOptions: query.filters,
            sortOptions: query.sort,
            paginationOptions: {
                page,
                limit,
            },
        });
    }

    @Auth()
    @Post('push-token')
    pushToken(@UserInfo() user: User, @Body() dto: PushTokenDto) {
        return this.usersService.pushExpoToken(user.id, dto)
    }

    @Auth()
    @Patch('avatar')
    uploadAvatar(@Body() uploadavatarDto: UploadAvatarDto, @UserInfo() user: User) {
        return this.usersService.uploadAvatar(uploadavatarDto.imageUrl, uploadavatarDto.publicId, user);
    }

    @Get(':id')
    @ResponseMessage('user.SUCCESS.GET_A_USER')
    findOne(@Param('id') id: User['id']) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @ResponseMessage('user.SUCCESS.UPDATE_A_USER')
    update(
        @Param('id') id: User['id'],
        @Body() updateStaffDto: UpdateStaffDto,
    ) {
        return this.usersService.update(id, updateStaffDto);
    }

    @Delete(':id')
    @ResponseMessage('user.SUCCESS.DELETE_A_USER')
    delete(@Param('id') id: User['id']) {
        return this.usersService.delete(id);
    }
}
