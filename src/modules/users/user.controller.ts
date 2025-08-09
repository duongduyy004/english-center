import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Public } from "@/decorator/customize.decorator";

@Controller('admin')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    @Public()
    createAdmin(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto)
    }
}