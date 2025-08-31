import { ClassEntity } from "modules/classes/entities/class.entity";
import { UserEntity } from "modules/users/entities/user.entity";
import { TeacherPaymentEntity } from "modules/teacher-payments/entities/teacher-payment.entity";
import { Entity, Column, OneToMany } from "typeorm";


@Entity('teacher')
export class TeacherEntity extends UserEntity {
    @Column({ default: true })
    isActive: boolean

    @Column({ nullable: true })
    introduction: string;

    @Column({ nullable: true })
    workExperience: string;

    @Column()
    description: string

    @Column("text", { array: true })
    qualifications: string[]

    @Column("text", { array: true })
    specializations: string[]

    @Column()
    salaryPerLesson: number

    @Column({ default: false })
    typical: boolean;

    @OneToMany(() => ClassEntity, (aclass) => aclass.teacher)
    classes: ClassEntity[]

    @OneToMany(() => TeacherPaymentEntity, payment => payment.teacher)
    payments: TeacherPaymentEntity
}
