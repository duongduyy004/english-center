import { UserEntity } from "@/modules/users/entities/user.entity";
import { ChildEntity, Column } from "typeorm";

@ChildEntity()
export class TeacherEntity extends UserEntity {
    @Column()
    isActive: boolean

    @Column()
    description: string

    @Column({ array: true })
    qualifications: string[]

    @Column({ array: true })
    specializations: string[]

    @Column()
    salary_per_lesson: number
}
