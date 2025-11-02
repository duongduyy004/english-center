import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEntity } from "./payment.entity";
import { PaymentRequestStatus } from "../dto/process-request-payment.dto";


@Entity('payment_requests')
export class PaymentRequestEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    amount: number;

    @Column()
    imageProof: string;

    @Column({ default: 'pending' })
    status: PaymentRequestStatus;

    @Column()
    requestedAt: Date;

    @Column({ nullable: true })
    processedAt?: Date;

    @Column({ nullable: true })
    processedBy?: string;

    @Column({ nullable: true })
    rejectionReason?: string;

    @ManyToOne(() => PaymentEntity, paymentId => paymentId.paymentRequests)
    paymentId: string;
}