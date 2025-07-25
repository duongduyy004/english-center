import { StudentEnity } from "@/modules/students/entities/student.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ClassEntity } from "./class.entity";

@Entity()
export class ClassStudentEntity {
    @PrimaryColumn()
    student_id: string

    @PrimaryColumn()
    class_id: string

    @Column()
    discount_percent: number

    @ManyToOne(() => StudentEnity, (student) => student.class_student)
    public student: StudentEnity

    @ManyToOne(() => ClassEntity, (aclass) => aclass.class_student)
    public aclass: ClassEntity
}