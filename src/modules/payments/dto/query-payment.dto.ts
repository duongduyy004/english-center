import { Class } from "@/modules/classes/class.domain";
import { Payment } from "@/modules/payments/payment.domain";
import { Student } from "@/modules/students/student.domain";

export class FilterPaymentDto {
    studentId: Student['id'];

    classId: Class['id'];

    month: number;

    year: number;

    status: string;

    startMonth: number;

    endMonth: number;
}

export class SortPaymentDto {
    orderBy: keyof Payment;
    order: 'ASC' | 'DESC'
}