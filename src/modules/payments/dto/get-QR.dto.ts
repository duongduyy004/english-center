import { Payment } from "modules/payments/payment.domain";

export class GetQRDto {
    paymentId: Payment['id']
    amount: number;
    des: string;
    download: boolean
}