import { StudentEntity } from "modules/students/entities/student.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { SessionEntity } from "./session.entity";

@Entity('attendance_session')
export class AttendanceSessionEntity {
    @PrimaryColumn()
    studentId: StudentEntity['id'];

    @PrimaryColumn()
    sessionId: SessionEntity['id'];

    @Column({ enum: ['present', 'absent', 'late'] })
    status: string;

    @Column({ nullable: true })
    note?: string

    @ManyToOne(() => StudentEntity, student => student.attendance, { eager: true })
    student?: StudentEntity

    @ManyToOne(() => SessionEntity, session => session.attendances, { eager: true })
    session?: SessionEntity

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    isModified?: boolean;
}