import { StudentEntity } from "@/modules/students/entities/student.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClassEntity } from "@/modules/classes/entities/class.entity";

@Entity('class_student')
export class ClassStudentEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    discount_percent: number

    @ManyToOne(() => StudentEntity, (student) => student.class_student)
    public student: StudentEntity

    @ManyToOne(() => ClassEntity, (aclass) => aclass.class_student)
    public class: ClassEntity
}