import { Payment } from "./payment.domain";

export class PaymentRequest {
    id: number;

    amount: number;

    imageProof: string;

    status: string;

    requestedAt: Date;

    processedAt: Date;

    processedBy: string;

    rejectionReason?: string;

    payment: Partial<Payment>
}