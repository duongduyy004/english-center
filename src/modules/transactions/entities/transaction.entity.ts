import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transaction')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ enum: ['revenue', 'expense'] })
    type: string;

    @Column()
    amount: number;

    @Column()
    description: number;

    @Column()
    transaction_at: Date;
}
