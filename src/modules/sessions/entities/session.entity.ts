import { ClassEntity } from "modules/classes/entities/class.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AttendanceSessionEntity } from "./attendance-session.entity";
import { Class } from "modules/classes/class.domain";

@Entity('sessions')
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    classId: Class['id']

    @Column()
    date: Date

    @ManyToOne(() => ClassEntity, aclass => aclass.session)
    @JoinTable({ name: 'classId' })
    class?: ClassEntity

    @OneToMany(() => AttendanceSessionEntity, attendanceSession => attendanceSession.session)
    attendances?: AttendanceSessionEntity[]
}
