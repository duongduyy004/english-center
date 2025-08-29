import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}
  getAdminDashboard() {
    // Logic for admin dashboard
    return this.dashboardRepository.getAdminDashboard();
  }

  getTeacherDashboard() {
    // Logic for teacher dashboard
    return this.dashboardRepository.getTeacherDashboard();
  }

  getStudentDashboard() {
    // Logic for student dashboard
    return this.dashboardRepository.getStudentDashboard();
  }

  getParentDashboard() {
    // Logic for parent dashboard
    return this.dashboardRepository.getParentDashboard();
  }
}
