import { Body, Controller, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Public } from "@/decorator/customize.decorator";
import { UserInfo } from "@/decorator/customize.decorator";
import { User } from "./user.domain";
import { UploadAvatarDto } from "./dto/upload-avatar.dto";
import { AssignRoleDto } from "./dto/assign-role.dto";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('admin')
    @Public()
    createAdmin(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto)
    }

    @Patch('avatar')
    uploadAvatar(@Body() uploadavatarDto: UploadAvatarDto, @UserInfo() user: User) {
        return this.usersService.uploadAvatar(uploadavatarDto.imageUrl, uploadavatarDto.publicId, user);
    }

    @Patch('role')
    assignRole(
        @Body() assignRoleDto: AssignRoleDto
    ) {
        return this.assignRole(assignRoleDto);
    }
}