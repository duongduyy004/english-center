import { Student } from "modules/students/student.domain";

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
        amount: number;
        imageProof: string;
        status: 'pending' | 'approved' | 'rejected';
        requestedAt: Date;
        processedAt?: Date;
        processedBy?: string;
        rejectionReason?: string;
    }[]
}