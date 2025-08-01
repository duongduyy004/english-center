import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }


  @Get('today/:classId')
  getTodaySession(@Param('classId') classId: number) {
    return this.sessionsService.getTodaySession(classId)
  }

  @Get('student/:studentId')
  getStudentAttendance(@Param('studentId') studentId: number) {
    return this.sessionsService.getStudentAttendance(studentId)
  }

  @Get('all/:sessionId')
  getAttendances(@Param('sessionId') sessionId: number) {
    return this.sessionsService.getAttendances(sessionId)
  }

  @Patch('/:sessionId')
  updateAttendanceSession(@Param('sessionId') sessionId: number, @Body() updateAttendanceSessionDto: UpdateAttendanceSessionDto[]) {
    return this.sessionsService.updateAttendanceSession(sessionId, updateAttendanceSessionDto)
  }

}
