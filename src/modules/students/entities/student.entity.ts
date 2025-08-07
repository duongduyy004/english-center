import { ClassStudentEntity } from "modules/classes/entities/class-student.entity";
import { ParentEntity } from "modules/parents/entities/parent.entity";
import { PaymentEntity } from "modules/payments/entities/payment.entity";
import { AttendanceSessionEntity } from "modules/sessions/entities/attendance-session.entity";
import { UserEntity } from "modules/users/entities/user.entity";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('student')
export class StudentEntity extends UserEntity {

    @ManyToOne(() => ParentEntity, parent => parent.students, { nullable: true })
    @JoinColumn()
    parent: ParentEntity;

    @OneToMany(() => ClassStudentEntity, classes => classes.student)
    classes: ClassStudentEntity[]

    @OneToMany(() => AttendanceSessionEntity, attendanceSession => attendanceSession.student)
    attendance: AttendanceSessionEntity[]

    @OneToMany(() => PaymentEntity, payments => payments.student)
    payments: PaymentEntity
}
