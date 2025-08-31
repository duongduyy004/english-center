import { User } from "modules/users/user.domain";
import { Class } from "modules/classes/class.domain";

export class Teacher extends User {
    isActive: boolean;

    introduction: string;

    workExperience: string;

    description: string;

    qualifications: string[];

    specializations: string[];

    salaryPerLesson: number;

    typical: boolean;

    classes: Partial<Class>[];
}