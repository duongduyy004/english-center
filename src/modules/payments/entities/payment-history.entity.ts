import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentEntity } from "./payment.entity";

@Entity('payment_history')
export class PaymentHistoryEntity {
    @PrimaryGeneratedColumn()
    id: string | number;

    @Column()
    method: string;

    @Column()
    amount: number;

    @Column()
    note: string;

    @Column()
    date: Date

    @ManyToOne(() => PaymentEntity, (payment) => payment.histories)
    payment: PaymentEntity
}