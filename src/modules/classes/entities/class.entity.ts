import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClassStudentEntity } from "./class-student.entity";
import { TeacherEntity } from "modules/teachers/entities/teacher.entity";
import { SessionEntity } from "modules/sessions/entities/session.entity";

class TimeSlots {
    @Column()
    start_time: string

    @Column()
    end_time: string
}

class Schedule {
    @Column()
    start_date: Date

    @Column()
    end_date: Date

    @Column({ type: 'text', array: true, enum: ['0', '1', '2', '3', '4', '5', '6'] })
    days_of_week: string[]

    @Column(() => TimeSlots)
    time_slots: TimeSlots
}

@Entity('class')
export class ClassEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    grade: number

    @Column()
    section: number

    @Column()
    year: number

    @Column()
    description: string

    @Column()
    feePerLesson: number

    @Column({ enum: ['active', 'upcoming', 'closed'] })
    status: string

    @Column()
    max_student: number

    @Column()
    room: string

    @Column(() => Schedule)
    schedule: Schedule

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)", onUpdate: "CURRENT_TIMESTAMP(0)" })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(() => ClassStudentEntity, students => students.class, { cascade: true })
    students: ClassStudentEntity[]

    @ManyToOne(() => TeacherEntity, teacher => teacher.classes, { cascade: true })
    @JoinColumn({ name: 'teacher' })
    teacher: TeacherEntity

    @OneToMany(() => SessionEntity, session => session.class)
    session: SessionEntity
}

