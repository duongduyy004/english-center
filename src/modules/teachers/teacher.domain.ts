import { User } from "@/modules/users/user.domain";

export class Teacher extends User {
    isActive: boolean;

    description: string

    qualifications: string[]

    specializations: string[]

    salaryPerLesson: number
}