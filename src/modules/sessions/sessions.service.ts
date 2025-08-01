import { Injectable } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { Class } from '../classes/class.domain';
import { Session } from './session.domain';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';
import { Student } from '../students/student.domain';

@Injectable()
export class SessionsService {
  constructor(
    private sessionRepository: SessionRepository
  ) { }

  getTodaySession(classId: Class['id']) {
    return this.sessionRepository.getTodaySession(classId)
  }

  updateAttendanceSession(sessionId: Session['id'], updateAttendanceSessionDto: UpdateAttendanceSessionDto[]) {
    return this.sessionRepository.updateAttendanceSession(sessionId, updateAttendanceSessionDto)
  }

  getStudentAttendance(studentId: Student['id']) {
    return this.sessionRepository.getStudentAttendance(studentId)
  }

  getAttendances(sessionId: Session['id']) {
    return this.sessionRepository.getAttendances(sessionId)
  }
}
