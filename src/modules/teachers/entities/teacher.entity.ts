import { UserEntity } from "@/modules/users/entities/user.entity";
import { Entity, Column } from "typeorm";

@Entity('teacher')
export class TeacherEntity extends UserEntity {
    @Column()
    isActive: boolean

    @Column()
    description: string

    @Column("text", { array: true })
    qualifications: string[]

    @Column("text", { array: true })
    specializations: string[]

    @Column()
    salaryPerLesson: number
}
