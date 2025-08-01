import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentHistoryEntity } from "./payment-history.entity";
import { StudentEntity } from "@/modules/students/entities/student.entity";
import { ClassEntity } from "@/modules/classes/entities/class.entity";

@Entity('payments')
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: string | number;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ default: 0 })
    totalLessons: number

    @Column({ default: 0 })
    paidAmount: number

    @Column()
    studentId: number;

    @Column()
    classId: number

    @ManyToOne(() => StudentEntity, student => student.payments)
    @JoinColumn({ name: 'studentId' })
    student: StudentEntity

    @ManyToOne(() => ClassEntity)
    @JoinColumn({ name: 'classId' })
    class: ClassEntity

    @OneToMany(() => PaymentHistoryEntity, (histories) => histories.payment, { cascade: true })
    histories: PaymentHistoryEntity[]

    @BeforeInsert()
    @BeforeUpdate()
    async updatePaidAmount() {
        if (this.histories) {
            let paidAmount = 0
            for (const history of this.histories) {
                paidAmount += history.amount
            }
            this.paidAmount = paidAmount
        }
    }
}
