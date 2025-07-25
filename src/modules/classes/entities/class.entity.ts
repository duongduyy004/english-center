import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassStudentEntity } from "./class-student.entity";

@Entity()
export class ClassEntity {
    @PrimaryGeneratedColumn()
    id: number

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
    fee_per_lesson: number

    @Column({ enum: ['active', 'upcoming', 'closed'] })
    status: string

    @Column()
    max_student: number

    @Column()
    room: string

    @Column()
    schedule: Schedule

    @OneToMany(() => ClassStudentEntity, class_student => class_student.aclass)
    class_student: ClassStudentEntity[]
}

class Schedule {
    @Column()
    start_date: Date

    @Column()
    end_date: Date

    @Column({ array: true, enum: ['0', '1', '2', '3', '4', '5', '6'] })
    days_of_week: string[]

    @Column()
    time_slots: TimeSlots
}

class TimeSlots {
    @Column()
    start_time: string

    @Column()
    end_time: string
}
