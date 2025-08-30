import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  getAdminDashboard() {
    return this.dashboardRepository.getAdminDashboard();
  }

  getTeacherDashboard(teacherId: string) {
    return this.dashboardRepository.getTeacherDashboard(teacherId);
  }

  getStudentDashboard(studentId: string) {
    return this.dashboardRepository.getStudentDashboard(studentId);
  }

  getParentDashboard(parentId: string) {
    return this.dashboardRepository.getParentDashboard(parentId);
  }
}
