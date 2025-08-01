import { Class } from "@/modules/classes/class.domain";
import { Student } from "@/modules/students/student.domain";

export class Payment {
    id: string | number;

    month: number;

    year: number;

    totalLessons: number

    paidAmount: number

    status: string

    student: Partial<Student>

    class: {
        id: number,
        name: string,
        lessons?: number
    }

    histories: {
        id: string | number,
        method: string,
        amount: number,
        note: string,
        date: Date
    }[];
}