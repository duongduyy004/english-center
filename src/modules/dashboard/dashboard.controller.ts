import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('admin')
  @ResponseMessage('dashboard.SUCCESS.GET_ADMIN_DASHBOARD')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('teacher/:teacherId')
  @ResponseMessage('dashboard.SUCCESS.GET_TEACHER_DASHBOARD')
  getTeacherDashboard(@Param('teacherId') teacherId: string) {
    return this.dashboardService.getTeacherDashboard(teacherId);
  }

  @Get('student/:studentId')
  @ResponseMessage('dashboard.SUCCESS.GET_STUDENT_DASHBOARD')
  getStudentDashboard(@Param('studentId') studentId: string) {
    return this.dashboardService.getStudentDashboard(studentId);
  }

  @Get('parent/:parentId')
  @ResponseMessage('dashboard.SUCCESS.GET_PARENT_DASHBOARD')
  getParentDashboard(@Param('parentId') parentId: string) {
    return this.dashboardService.getParentDashboard(parentId);
  }
}
