import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';
import { QueryDto } from 'utils/types/query.dto';
import { Class } from 'modules/classes/class.domain';
import { Student } from 'modules/students/student.domain';
import { Session } from './session.domain';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }


  @Get('today/:classId')
  getTodaySession(@Param('classId') classId: Class['id']) {
    return this.sessionsService.getTodaySession(classId)
  }

  @Get('student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: Student['id']) {
    return this.sessionsService.getStudentAttendance(studentId)
  }

  @Get('all/:classId')
  getAttendancesByClassId(
    @Param('classId') classId: Class['id'],
    @Query() query: QueryDto
  ) {
    const limit = query.limit;
    const page = query.page;
    return this.sessionsService.getAttendancesByClassId(classId, { limit, page })
  }

  @Patch('/:sessionId')
  updateAttendanceSession(@Param('sessionId') sessionId: Session['id'], @Body() updateAttendanceSessionDto: UpdateAttendanceSessionDto[]) {
    return this.sessionsService.updateAttendanceSession(sessionId, updateAttendanceSessionDto)
  }

}
