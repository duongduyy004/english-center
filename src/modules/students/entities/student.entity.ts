import { ClassStudentEntity } from "@/modules/classes/entities/class-student.entity";
import { ParentEntity } from "@/modules/parents/entities/parent.entity";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { ChildEntity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@ChildEntity()
export class StudentEnity extends UserEntity {

    @ManyToOne(() => ParentEntity, parent => parent.students, { nullable: true })
    @JoinColumn()
    parent: ParentEntity;

    @OneToMany(() => ClassStudentEntity, class_student => class_student.student)
    class_student: ClassStudentEntity[]
}
