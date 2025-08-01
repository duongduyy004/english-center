import { Class } from "@/modules/classes/class.domain";
import { Student } from "@/modules/students/student.domain";
import { Exclude } from "class-transformer";

export class Session {
    id: number;

    date: Date

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