import { CreateUserDto } from "modules/users/dto/create-user.dto";

export class CreateTeacherDto extends CreateUserDto {
    isActive: boolean;

    description: string

    qualifications: string[]

    specializations: string[]

    salaryPerLesson: number
}
