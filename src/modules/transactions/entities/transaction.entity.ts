import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionCategoryEntity } from "./transaction-category.entity";

@Entity('transaction')
export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    amount: number;

    @Column()
    description: string;

    @Column({ default: () => 'CURRENT_DATE' })
    transactionAt: Date;

    @ManyToOne(() => TransactionCategoryEntity)
    @JoinColumn({ name: 'categoryId' })
    category: TransactionCategoryEntity;

    @DeleteDateColumn()
    deletedAt: Date;
}
