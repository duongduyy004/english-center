import { StudentEntity } from "@/modules/students/entities/student.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
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

    @ManyToOne(() => StudentEntity, student => student.attendance)
    student?: StudentEntity

    @ManyToOne(() => SessionEntity, session => session.attendances)
    session?: SessionEntity

    isModified?: boolean;
}