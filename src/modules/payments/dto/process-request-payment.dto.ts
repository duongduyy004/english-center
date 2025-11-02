export class ProcessRequestPaymentDto {
    status: PaymentRequestStatus

    rejectionReason?: string;
}

export enum PaymentRequestStatus {
    APPROVE = 'approved',
    REJECT = 'rejected',
    PENDING = 'pending'
}
