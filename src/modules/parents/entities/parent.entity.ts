import { StudentEntity } from "modules/students/entities/student.entity";
import { UserEntity } from "modules/users/entities/user.entity";
import { Entity, OneToMany } from "typeorm";

@Entity('parent')
export class ParentEntity extends UserEntity {
    @OneToMany(() => StudentEntity, student => student.parent, { nullable: true })
    students: StudentEntity[];
}