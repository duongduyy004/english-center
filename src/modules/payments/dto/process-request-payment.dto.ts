export class ProcessRequestPaymentDto {
    imageProof: string;

    action: RequestPaymentAction
}

export class RequestPaymentAction {
    static PROCESS = 'process';
    static REJECT = 'reject';
}
