import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClassStudentEntity } from "./class-student.entity";

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
    feePerLesson: number

    @Column({ enum: ['active', 'upcoming', 'closed'] })
    status: string

    @Column()
    max_student: number

    @Column()
    room: string

    @Column(() => Schedule)
    schedule: Schedule

    @OneToMany(() => ClassStudentEntity, class_student => class_student.class)
    class_student: ClassStudentEntity[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(0)", onUpdate: "CURRENT_TIMESTAMP(0)" })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}

