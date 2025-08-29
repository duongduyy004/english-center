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
import { AuditLogService } from "../audit-log/audit-log.service";
import { ClsService } from "nestjs-cls";
import { TeacherPaymentsService } from "../teacher-payments/teacher-payments.service";

const ATTENDANCE_STATUS = Object.freeze({
  absent: 'vắng',
  present: 'có mặt',
  late: 'muộn'
})

export class SessionRepository {
  constructor(
    @InjectRepository(AttendanceSessionEntity) private attendanceSessionRepository: Repository<AttendanceSessionEntity>,
    @InjectRepository(SessionEntity) private sessionRepository: Repository<SessionEntity>,
    private classesService: ClassesService,
    private studentsService: StudentsService,
    private paymentsService: PaymentsService,
    private auditLogService: AuditLogService,
    private clsService: ClsService,
    private teacherPaymentsService: TeacherPaymentsService
  ) { }

  async create(id: Class['id']) {
    const classEntity = await this.classesService.findOne(id);
    const studentIds = classEntity.students.map((item) =>
      item.student.id.toString(),
    );

    const sessionEntity = this.sessionRepository.create({
      date: dayjs().toDate(),
      classId: id
    })
    await this.sessionRepository.save(sessionEntity, { listeners: false })

    const attendances: AttendanceSessionEntity[] = studentIds.map((item) => ({
      studentId: item,
      sessionId: sessionEntity.id,
      status: 'absent',
    }));

    await this.attendanceSessionRepository.insert(attendances);
    const session = await this.sessionRepository.findOne({
      where: { id: sessionEntity.id },
      relations: ['attendances.student', 'class'],
    });
    return session;
  }

  async getTodaySession(id: Class['id']) {
    const classEntity = await this.classesService.findOne(id);

    const today = dayjs();
    const startDate = dayjs(classEntity.schedule.start_date);
    const endDate = dayjs(classEntity.schedule.end_date);

    const checkDay = classEntity.schedule.days_of_week.find(
      (item) => parseInt(item) === today.day(),
    )
      ? true
      : false;

    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();

    if (!(today >= startDate && today <= endDate && checkDay))
      throw new BadRequestException('no scheduled today');

    //check if today session of this class have not created yet
    const sessionEntity = await this.sessionRepository.findOne({
      where: {
        classId: id,
        date: Between(todayStart, todayEnd),
      },
      relations: ['attendances.student', 'class'],
    });

    let session: SessionEntity = null;
    if (!sessionEntity) {
      session = await this.create(id);
      return SessionMapper.toDomain(session);
    }
    return SessionMapper.toDomain(sessionEntity);
  }

  async getAttendancesByClassId(
    classId: Class['id'],
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponseDto<Session>> {
    const [entities, total] = await this.sessionRepository.findAndCount({
      where: { classId },
      relations: ['class', 'attendances.student'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    const totalItems = total;
    const totalPages = Math.ceil(totalItems / paginationOptions.limit);
    return {
      meta: {
        limit: paginationOptions.limit,
        page: paginationOptions.page,
        totalPages,
        totalItems,
      },
      result: entities
        ? entities.map((item) => SessionMapper.toDomain(item))
        : null,
    };
  }



  async getSessions(classId: Class['id']) {
    return await this.sessionRepository.count({
      where: { classId },
    });
  }



  async updateAttendanceSession(sessionId: Session['id'], payload: UpdateAttendanceSessionDto[]) {
    // Store old values before update for audit logging
    const oldAttendances = await this.attendanceSessionRepository.find({
      where: {
        sessionId,
        studentId: In(payload.map(item => item.studentId))
      },
      relations: ['student']
    });

    const studentIds = payload.map(item => item.studentId)
    const statusCases = payload.map(item => `WHEN '${item.studentId}' THEN '${item.status}'`).join(' ')
    const noteCases = payload.map(item => `WHEN '${item.studentId}' THEN '${item.note || ''}'`).join(' ')

    const updateRes = await this.attendanceSessionRepository.createQueryBuilder().update()
      .set({
        status: () => `CASE studentId ${statusCases} ELSE status END`,
        note: () => `CASE studentId ${noteCases} ELSE note END`
      })
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

    // Audit logging after update
    await this.auditAttendanceChanges(sessionId, oldAttendances, entity.attendances, payload);

    this.paymentsService.autoUpdatePaymentRecord(entity)
    this.teacherPaymentsService.autoUpdatePayment(entity);
    return updateRes
  }

  private async auditAttendanceChanges(
    sessionId: Session['id'],
    oldAttendances: AttendanceSessionEntity[],
    newAttendances: AttendanceSessionEntity[],
    payload: UpdateAttendanceSessionDto[]
  ) {
    try {
      // Get current user from CLS context for audit logging
      const currentUser = this.clsService.get('user');
      const method = this.clsService.get('method') || 'PUT';
      const path = this.clsService.get('path') || '/sessions/attendance';

      if (!currentUser) return; // Skip audit if no user context

      const changedStudents = [];

      // Check each student for status changes
      for (const oldAttendance of oldAttendances) {
        const newAttendance = newAttendances.find(na => na.studentId === oldAttendance.studentId);

        if (newAttendance && oldAttendance.status !== newAttendance.status) {
          changedStudents.push({
            studentId: oldAttendance.studentId,
            studentName: oldAttendance.student?.name || newAttendance.student?.name || 'Unknown',
            studentEmail: oldAttendance.student.email || 'Unknown',
            oldStatus: oldAttendance.status,
            newStatus: newAttendance.status,
            note: newAttendance.note
          });
        }
      }
      // Log bulk update summary if there were changes
      if (changedStudents.length > 0) {
        // Get session and class information for description
        const session = await this.sessionRepository.findOne({
          where: { id: sessionId },
          relations: ['class']
        });

        const className = session?.class?.name || 'Unknown Class';
        const currentDate = new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        // Generate HTML description in the same format as audit log
        const studentChanges = changedStudents.map(student =>
          `<li><strong>${student.studentName}</strong> - <em>${student.studentEmail}</em>: <span style="color: #666;">${ATTENDANCE_STATUS[student.oldStatus]}</span> → <span style="color: blue;">${ATTENDANCE_STATUS[student.newStatus]}</span>${student.note ? ` <small>(ghi chú: ${student.note})</small>` : ''}</li>`
        ).join('');

        const description = `<strong>Cập nhật</strong> <strong>điểm danh lớp ${className}:${session.class.year}</strong> bởi <strong>${currentUser.name}</strong> - <em>${currentUser.email}</em> - ${currentDate}:<ul style="margin: 8px 0; padding-left: 20px;">${studentChanges}</ul>`;

        await this.auditLogService.track({
          user: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role?.name || 'user'
          },
          entityName: 'SessionEntity',
          entityId: sessionId,
          path: path,
          method: method,
          action: 'UPDATE_ATTENDANCE',
          changedFields: ['status'],
          oldValue: changedStudents.map(item => ({
            status: item.oldStatus,
            studentName: item.studentName,
            studentEmail: item.studentEmail
          })),
          newValue: changedStudents.map(item => ({
            status: item.newStatus,
            studentName: item.studentName,
            studentEmail: item.studentEmail
          })),
          description: description
        });
      }

    } catch (error) {
      console.error('Error in audit logging for attendance changes:', error);
      // Don't throw error - audit logging failure shouldn't break the main operation
    }
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

  async getClassSessionsInMonth(
    classId: Class['id'],
    month: number,
    year: number,
  ) {
    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.sessionRepository.count({
      where: {
        classId,
        date: Between(startDate, endDate),
      },
    });
  }

  async getTeacherSessionsInMonth(
    teacherId: string,
    month: number,
    year: number,
  ) {
    // Get all classes taught by this teacher
    const teacherClasses = await this.classesService.findClassesByTeacherId(
      teacherId,
    );
    const classIds = teacherClasses.map((cls) => cls.id);

    if (classIds.length === 0) {
      return 0;
    }

    // Create date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.sessionRepository.count({
      where: {
        classId: In(classIds),
        date: Between(startDate, endDate),
      },
    });
  }
  async getTotalSessions(classId: Class['id']) {
    return await this.sessionRepository.count({
      where: { classId }
    })
  }
}


