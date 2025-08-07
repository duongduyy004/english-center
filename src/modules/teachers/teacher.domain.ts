import { User } from "modules/users/user.domain";
import { Class } from "modules/classes/class.domain";

export class Teacher extends User {
    isActive: boolean;

    description: string

    qualifications: string[]

    specializations: string[]

    salaryPerLesson: number

    classes: Partial<Class>[]
}