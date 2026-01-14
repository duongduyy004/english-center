import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { AttendanceSessionEntity } from 'modules/sessions/entities/attendance-session.entity';
import { ClassEntity } from 'modules/classes/entities/class.entity';
import { StudentEntity } from 'modules/students/entities/student.entity';
import { session_data } from './session-data';
import { PaymentsService } from 'modules/payments/payments.service';
import { TeacherPaymentsService } from 'modules/teacher-payments/teacher-payments.service';

@Injectable()
export class SessionSeedService {
    private readonly logger = new Logger(SessionSeedService.name);

    constructor(
        @InjectRepository(SessionEntity)
        private sessionRepository: Repository<SessionEntity>,
        @InjectRepository(AttendanceSessionEntity)
        private attendanceRepository: Repository<AttendanceSessionEntity>,
        @InjectRepository(ClassEntity)
        private classRepository: Repository<ClassEntity>,
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
        private paymentsService: PaymentsService,
        private teacherPaymentsService: TeacherPaymentsService,
    ) { }

    async run() {
        const session = await this.sessionRepository.find();
        if (session.length > 0) return;
        this.logger.log('Seeding sessions...');

        const classes = await this.classRepository.find();
        const students = await this.studentRepository.find();

        for (const data of session_data) {
            const classEntity = classes.find(c =>
                c.grade == Number(data.class.grade) &&
                c.section == Number(data.class.section) &&
                c.year == Number(data.class.year)
            );

            if (!classEntity) {
                this.logger.warn(`Class not found for session: ${JSON.stringify(data.class)}`);
                continue;
            }

            // Create Session
            const session = this.sessionRepository.create({
                classId: classEntity.id,
                date: new Date(data.date),
            });

            const savedSession = await this.sessionRepository.save(session);

            // Create Attendances
            if (data.attendances && data.attendances.length > 0) {
                const attendances = [];
                for (const att of data.attendances) {
                    const studentEntity = students.find(s => s.email === att.student);
                    if (studentEntity) {
                        const attendance = this.attendanceRepository.create({
                            sessionId: savedSession.id,
                            studentId: studentEntity.id,
                            status: att.status,
                            note: att.note,
                            createdAt: new Date(att.createdAt),
                            updatedAt: new Date(att.updatedAt)
                        });
                        attendances.push(attendance);
                    }
                }
                await this.attendanceRepository.save(attendances);
            }
        }

        const sessions = await this.sessionRepository.find({
            relations: ['class.students', 'attendances.student']
        });
        for (const session of sessions) {
            await Promise.all([
                this.paymentsService.autoUpdatePaymentRecord(session),
                this.teacherPaymentsService.autoUpdatePayment(session),
            ])
        }
        this.logger.log('Sessions seeded.');
    }
}
