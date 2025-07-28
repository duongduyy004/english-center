import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { Entity, Column, OneToMany } from "typeorm";

@Entity('teacher')
export class TeacherEntity extends UserEntity {
    @Column({ default: true })
    isActive: boolean

    @Column()
    description: string

    @Column("text", { array: true })
    qualifications: string[]

    @Column("text", { array: true })
    specializations: string[]

    @Column()
    salaryPerLesson: number

    @OneToMany(() => ClassEntity, (aclass) => aclass.teacher)
    classes: ClassEntity[]
}
