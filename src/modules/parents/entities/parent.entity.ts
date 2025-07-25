import { StudentEnity } from "@/modules/students/entities/student.entity";
import { UserEntity } from "@/modules/users/entities/user.entity";
import { ChildEntity, OneToMany } from "typeorm";

@ChildEntity()
export class ParentEntity extends UserEntity {
    @OneToMany(() => StudentEnity, student => student.parent, { nullable: true })
    students: StudentEnity[];
}
