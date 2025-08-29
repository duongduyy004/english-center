import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { Class } from 'modules/classes/class.domain';
import { Session } from './session.domain';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';
import { Student } from 'modules/students/student.domain';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';

@Injectable()
export class SessionsService {
  constructor(private sessionRepository: SessionRepository) {}

  getTodaySession(classId: Class['id']) {
    return this.sessionRepository.getTodaySession(classId);
  }

  updateAttendanceSession(
    sessionId: Session['id'],
    updateAttendanceSessionDto: UpdateAttendanceSessionDto[],
  ) {
    return this.sessionRepository.updateAttendanceSession(
      sessionId,
      updateAttendanceSessionDto,
    );
  }

  getStudentAttendance(studentId: Student['id']) {
    return this.sessionRepository.getStudentAttendance(studentId);
  }

  getAttendancesByClassId(
    classId: Class['id'],
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponseDto<Session>> {
    return this.sessionRepository.getAttendancesByClassId(
      classId,
      paginationOptions,
    );
  }

  getSessions(classId: Class['id']) {
    return this.sessionRepository.getSessions(classId);
  }

  getTeacherSessionsInMonth(teacherId: string, month: number, year: number) {
    return this.sessionRepository.getTeacherSessionsInMonth(
      teacherId,
      month,
      year,
    );
  }

  getClassSessionsInMonth(classId: Class['id'], month: number, year: number) {
    return this.sessionRepository.getClassSessionsInMonth(classId, month, year);
  }
}
