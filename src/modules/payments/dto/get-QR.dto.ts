import { Payment } from "modules/payments/payment.domain";

export class GetQRDto {
    paymentId: Payment['id']
    amount: number;
    download: boolean
}