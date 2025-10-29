import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StudentEntity } from "modules/students/entities/student.entity";
import { ClassEntity } from "modules/classes/entities/class.entity";
import { Student } from "modules/students/student.domain";


export class Histories {
    method: string;

    amount: number;

    note: string;

    date?: Date
}

export class PaymentRequests {
    amount: number;

    imageProof: string;

    status: 'pending' | 'approved' | 'rejected';

    requestedAt: Date;

    processedAt?: Date;

    processedBy?: string;

    rejectionReason?: string;
}

@Entity('payments')
export class PaymentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    @Column('jsonb', { nullable: true, default: [] })
    paymentRequests: PaymentRequests[]

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
        else if (this.paidAmount < this.totalAmount) this.status = 'partial';
        else if (this.paidAmount >= this.totalAmount) this.status = 'paid';
    }
}
