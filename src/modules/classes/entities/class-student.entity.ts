import { StudentEntity } from "modules/students/entities/student.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClassEntity } from "modules/classes/entities/class.entity";
import { Exclude } from "class-transformer";

@Entity('class_student')
export class ClassStudentEntity {
    @PrimaryColumn()
    @Exclude({ toPlainOnly: true })
    studentId: string | number;

    @PrimaryColumn()
    @Exclude({ toPlainOnly: true })
    classId: string | number;

    @Column()
    discountPercent: number

    @ManyToOne(() => StudentEntity, (student) => student.classes)
    @JoinTable({ name: 'studentId' })
    student?: StudentEntity

    @ManyToOne(() => ClassEntity, (aclass) => aclass.students, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinTable({ name: 'studentId' })
    class?: ClassEntity

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}