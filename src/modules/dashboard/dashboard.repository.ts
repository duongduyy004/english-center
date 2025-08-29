import { Injectable } from '@nestjs/common';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { ParentsService } from '../parents/parents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from '../students/entities/student.entity';
import { TeacherEntity } from '../teachers/entities/teacher.entity';
import { ParentEntity } from '../parents/entities/parent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardRepository {
  constructor(
    // private readonly studentService: StudentsService,
    // private readonly teacherService: TeachersService,
    // private readonly parentService: ParentsService,
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(TeacherEntity)
    private readonly teacherRepository: Repository<TeacherEntity>,
    @InjectRepository(ParentEntity)
    private readonly parentRepository: Repository<ParentEntity>,
  ) {}
  async getAdminDashboard() {
    // Logic for fetching admin dashboard data
  }

  async getTeacherDashboard() {
    // Logic for fetching teacher dashboard data
  }

  async getStudentDashboard() {
    // Logic for fetching student dashboard data
  }

  async getParentDashboard() {
    // Logic for fetching parent dashboard data
  }
}
