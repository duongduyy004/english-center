import { Column, PrimaryGeneratedColumn } from "typeorm";

export class TeacherPaymentEntity {
    @PrimaryGeneratedColumn()
    id: string | number;

    @Column()
    month: number;

    @Column()
    year: number;
}