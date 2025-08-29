import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('transaction_category')
export class TransactionCategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: ['revenue', 'expense'] })
    type: string;

    @Column()
    name: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}