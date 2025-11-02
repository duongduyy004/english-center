import { Student } from "modules/students/student.domain";
import { PaymentRequestStatus } from "./dto/process-request-payment.dto";

export class Payment {
    id: string;

    month: number;

    year: number;

    totalLessons: number

    paidAmount: number

    totalAmount: number;

    discountAmount: number;

    status: string

    student: Partial<Student>

    class: {
        id: string,
        name: string,
        lessons?: number
    }

    histories: {
        method: string,
        amount: number,
        note: string,
        date: Date
    }[];

    paymentRequests: {
        id: number;
        amount: number;
        imageProof: string;
        status: PaymentRequestStatus;
        requestedAt: Date;
        processedAt?: Date;
        processedBy?: string;
        rejectionReason?: string;
    }[]
}