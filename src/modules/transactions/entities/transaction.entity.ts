import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionCategoryEntity } from "./transaction-category.entity";
import { addAbortSignal } from "stream";


@Entity('transaction')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    description: string;

    @Column({ default: () => 'CURRENT_DATE' })
    transaction_at: Date;

    @OneToOne(() => TransactionCategoryEntity)
    @JoinColumn({ name: 'category_id' })
    category: TransactionCategoryEntity;

    @DeleteDateColumn()
    deleteAt: Date;
}
