import { Class } from "modules/classes/class.domain";
import { Student } from "modules/students/student.domain";

export class Payment {
    id: string | number;

    month: number;

    year: number;

    totalLessons: number

    paidAmount: number

    totalAmount: number;

    discountAmount: number;

    status: string

    student: Partial<Student>

    class: {
        id: number,
        name: string,
        lessons?: number
    }

    histories: {
        method: string,
        amount: number,
        note: string,
        date: Date
    }[];
}