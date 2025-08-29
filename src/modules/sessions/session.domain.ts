import { Class } from "modules/classes/class.domain";
import { Student } from "modules/students/student.domain";
import { Exclude } from "class-transformer";

export class Session {
    id: string;

    date: Date;

    isActive: boolean;

    @Exclude({ toPlainOnly: true })
    classId?: number;

    class: Partial<Class>

    attendances: {
        isModified?: boolean,
        status: string,
        student: Partial<Student>,
        note?: string
    }[]
}