import { InjectRepository } from "@nestjs/typeorm";
import { AttendanceSessionEntity } from "./entities/attendance-session.entity";
import { Between, In, Repository } from "typeorm";
import { SessionEntity } from "./entities/session.entity";
import { Class } from "modules/classes/class.domain";
import { ClassesService } from "modules/classes/classes.service";
import * as dayjs from "dayjs";
import { BadRequestException } from "@nestjs/common";
import { SessionMapper } from "./session.mapper";
import { Session } from "./session.domain";
import { UpdateAttendanceSessionDto } from "./dto/update-attendance-session.dto";
import { Student } from "modules/students/student.domain";
import { StudentsService } from "modules/students/students.service";
import { PaymentsService } from "../payments/payments.service";
import { IPaginationOptions } from "utils/types/pagination-options";
import { PaginationResponseDto } from "utils/types/pagination-response.dto";

export class SessionRepository {
    constructor(
        @InjectRepository(AttendanceSessionEntity) private attendanceSessionRepository: Repository<AttendanceSessionEntity>,
        @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>,
        private classesService: ClassesService,
        private studentsService: StudentsService,
        private paymentsService: PaymentsService
    ) { }

    async create(id: Class['id']) {
        const classEntity = await this.classesService.findOne(id)
        const studentIds = classEntity.students.map(item => item.student.id.toString())

        const sessionEntity = this.sessionRepository.create({
            date: dayjs().toDate(),
            classId: classEntity.id
        })
        await this.sessionRepository.save(sessionEntity)

        const attendances: AttendanceSessionEntity[] = studentIds.map(item => ({
            studentId: item,
            sessionId: sessionEntity.id,
            status: 'absent'
        }))

        await this.attendanceSessionRepository.insert(attendances)
        const session = await this.sessionRepository.findOne({
            where: { id: sessionEntity.id },
            relations: ['attendances.student', 'class']
        })
        return session
    }

    async getTodaySession(id: Class['id']) {
        const classEntity = await this.classesService.findOne(id);

        const today = dayjs()
        const startDate = dayjs(classEntity.schedule.start_date);
        const endDate = dayjs(classEntity.schedule.end_date);

        const checkDay = classEntity.schedule.days_of_week.find(item => parseInt(item) === today.day()) ? true : false

        const todayStart = dayjs().startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();

        if (!(today >= startDate && today <= endDate && checkDay))
            throw new BadRequestException('no scheduled today')

        //check if today session of this class have not created yet
        const sessionEntity = await this.sessionRepository.findOne({
            where: {
                classId: id,
                date: Between(todayStart, todayEnd)
            },
            relations: ['attendances.student', 'class']
        })

        let session: SessionEntity = null
        if (!sessionEntity) {
            session = await this.create(id);
            return SessionMapper.toDomain(session)
        }
        return SessionMapper.toDomain(sessionEntity)
    }

    async getAttendancesByClassId(classId: Class['id'], paginationOptions: IPaginationOptions): Promise<PaginationResponseDto<Session>> {
        const [entities, total] = await this.sessionRepository.findAndCount({
            where: { classId },
            relations: ['class', 'attendances.student'],
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)
        return {
            meta: {
                limit: paginationOptions.limit,
                page: paginationOptions.page,
                totalPages,
                totalItems
            },
            result: entities ? entities.map(item => SessionMapper.toDomain(item)) : null
        }
    }

    async updateAttendanceSession(sessionId: Session['id'], payload: UpdateAttendanceSessionDto[]) {

        const studentIds = payload.map(item => parseInt(item.studentId))
        const cases = payload.map(item => `WHEN ${parseInt(item.studentId)} THEN '${item.status}'`).join(' ')

        const updateRes = await this.attendanceSessionRepository.createQueryBuilder().update()
            .set({ status: () => `CASE studentId ${cases} ELSE status END` })
            .where('studentId IN (:...studentIds)', { studentIds })
            .andWhere('sessionId = :sessionId', { sessionId })
            .execute()

        const entity = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['class.students', 'attendances.student']
        })

        for (const item of entity.attendances) {
            for (const payloadItem of payload) {
                if (item.student.id.toString() === payloadItem.studentId.toString()) {
                    item.isModified = payloadItem.isModified;

                }
            }
        }

        this.paymentsService.autoUpdatePaymentRecord(entity)
        return updateRes
    }

    async getStudentAttendance(studentId: Student['id']) {
        const studentAttendance = await this.sessionRepository.createQueryBuilder('sessions')
            .select([
                'class.id AS "classId"',
                'class.name AS "className"',
                'class.grade AS "classGrade"',
                'class.section AS "classSection"',
                'class.year AS "classYear"',
                'class.status AS "classStatus"',
                'attendances.studentId AS "studentId"',
                'sessions.date AS "date"',
                'attendances.sessionId AS "sessionId"',
                'attendances.status AS "status"'
            ])
            .leftJoin('sessions.attendances', 'attendances')
            .leftJoin('sessions.class', 'class')
            .where(`attendances.studentId = :studentId`, { studentId })
            .groupBy('sessions.date')
            .addGroupBy('attendances.studentId')
            .addGroupBy('attendances.sessionId')
            .addGroupBy('class.id')
            .addGroupBy('class.name')
            .addGroupBy('class.grade')
            .addGroupBy('class.section')
            .addGroupBy('class.year')
            .addGroupBy('class.status')
            .getRawMany();

        const student = await this.studentsService.findOne(studentId)

        let totalSessions: number = 0;
        let presentSessions: number = 0;
        let absentSessions: number = 0;
        let lateSessions: number = 0;
        let absentSessionsDetails = []

        const detailedAttendance = studentAttendance.map(item => {
            totalSessions++;
            switch (item.status) {
                case 'present':
                    presentSessions++;
                    break;
                case 'absent':
                    absentSessions++;
                    absentSessionsDetails.push({
                        date: item.date,
                        class: {
                            id: item.classId,
                            name: item.className,
                            grade: item.classGrade,
                            section: item.classSection,
                            year: item.classYear,
                            status: item.classStatus
                        },
                        note: item?.note
                    })
                    break;
                case 'late':
                    lateSessions++;
                    break;
            }

            return {
                date: item.date,
                class: {
                    id: item.classId,
                    name: item.className,
                    grade: item.classGrade,
                    section: item.classSection,
                    year: item.classYear,
                    status: item.classStatus
                },
                status: item.status,
                note: item?.note
            }
        })

        return {
            student: {
                id: student.id,
                name: student.name,
                email: student.email
            },
            attendanceStats: {
                totalSessions,
                presentSessions,
                absentSessions,
                lateSessions
            },
            absentSessionsDetails,
            detailedAttendance,
            totalRecord: studentAttendance.length
        }
    }


    async getSessions(classId: Class['id']) {
        return await this.sessionRepository.count({
            where: { classId }
        })
    }
}

