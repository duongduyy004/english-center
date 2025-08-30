import { Body, Controller, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Public } from "@/decorator/customize.decorator";
import { User as UserDecorator } from "@/decorator/customize.decorator";
import { User } from "./user.domain";
import { UploadAvatarDto } from "./dto/upload-avatar.dto";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('admin')
    @Public()
    createAdmin(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto)
    }

    @Patch('avatar')
    uploadAvatar(@Body() uploadavatarDto: UploadAvatarDto, @UserDecorator() user: User) {
        return this.usersService.uploadAvatar(uploadavatarDto.imageUrl, uploadavatarDto.publicId, user);
    }
}