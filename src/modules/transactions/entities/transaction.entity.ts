import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transaction')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ enum: ['revenue', 'expense'] })
    type: string;

    @Column()
    amount: number;

    @Column()
    description: string;

    @Column({ default: () => 'CURRENT_DATE' })
    transaction_at: Date;

    @DeleteDateColumn()
    deleteAt: Date;
}
