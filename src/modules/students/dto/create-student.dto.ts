import { Class } from "modules/classes/class.domain";
import { Parent } from "modules/parents/parent.domain";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStudentDto extends CreateUserDto {

    @IsOptional()
    parent?: Parent;

    @IsOptional()
    classes?: Class[];
}
