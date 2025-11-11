import { AfterInsert, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "modules/students/entities/student.entity";
import { ClassEntity } from "modules/classes/entities/class.entity";
import { Student } from "modules/students/student.domain";
import * as crypto from "crypto";

export class Histories {
    method: string;

    amount: number;

    note: string;

    date?: Date
}

@Entity('payments')
export class PaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    referenceCode: string;

    @Column()
    month: number;

    @Column()
    year: number;

    @Column({ default: 0 })
    totalLessons: number

    @Column({ default: 0 })
    paidAmount: number

    @Column({ default: 0 })
    totalAmount: number

    @Column({ default: 0 })
    discountPercent: number

    @Column({ enum: ['pending', 'partial', 'paid'], default: 'pending' })
    status: string

    @Column()
    studentId: Student['id'];

    @Column()
    classId: Student['id'];

    @ManyToOne(() => StudentEntity, student => student.payments)
    @JoinColumn({ name: 'studentId' })
    student: StudentEntity

    @ManyToOne(() => ClassEntity)
    @JoinColumn({ name: 'classId' })
    class: ClassEntity

    @Column('jsonb', { nullable: true, default: [] })
    histories: Histories[]

    @BeforeInsert()
    @BeforeUpdate()
    generateReferenceCode() {
        if (!this.referenceCode) {
            const date = `${this.year}${this.month}`

            const hash = crypto.createHash('sha256')
                .update(`${this.studentId}-${this.classId}-${Date.now()}`)
                .digest('hex')
                .substring(0, 8)
                .toUpperCase()
            this.referenceCode = `${date}${hash}`
        }
    }

    @BeforeUpdate()
    @BeforeInsert()
    updateAmount() {
        if (this.histories) {
            this.paidAmount = this.histories.reduce((sum, history) => sum + +history.amount, 0);
        }
    }

    @BeforeUpdate()
    updateStatus() {
        if (this.paidAmount === 0) this.status = 'pending';
        else if (this.paidAmount < this.totalAmount - this.discountPercent * this.totalAmount / 100) this.status = 'partial';
        else if (this.paidAmount >= this.totalAmount - this.discountPercent * this.totalAmount / 100) this.status = 'paid';
    }
}
