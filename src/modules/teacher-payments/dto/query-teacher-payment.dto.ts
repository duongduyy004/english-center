import { Class } from "modules/classes/class.domain";
import { Payment } from "modules/payments/payment.domain";
import { Teacher } from "modules/teachers/teacher.domain";

export class FilterTeacherPaymentDto {
    teacherId: Teacher['id'];

    month: number;

    year: number;

    status: string;

    startMonth: number;

    endMonth: number;
}

export class SortTeacherPaymentDto {
    orderBy: keyof Payment;
    order: 'ASC' | 'DESC'
}