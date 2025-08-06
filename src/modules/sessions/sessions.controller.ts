import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UpdateAttendanceSessionDto } from './dto/update-attendance-session.dto';
import { QueryDto } from '@/utils/types/query.dto';

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

  @Get('all/:classId')
  getAttendancesByClassId(
    @Param('classId') classId: number,
    @Query() query: QueryDto
  ) {
    const limit = query.limit;
    const page = query.page;
    return this.sessionsService.getAttendancesByClassId(classId, { limit, page })
  }

  @Patch('/:sessionId')
  updateAttendanceSession(@Param('sessionId') sessionId: number, @Body() updateAttendanceSessionDto: UpdateAttendanceSessionDto[]) {
    return this.sessionsService.updateAttendanceSession(sessionId, updateAttendanceSessionDto)
  }

}
