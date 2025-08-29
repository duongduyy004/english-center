import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('teacher')
  getTeacherDashboard() {
    return this.dashboardService.getTeacherDashboard();
  }

  @Get('student')
  getStudentDashboard() {
    return this.dashboardService.getStudentDashboard();
  }

  @Get('parent')
  getParentDashboard() {
    return this.dashboardService.getParentDashboard();
  }
}
