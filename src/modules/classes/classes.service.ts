import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassRepository } from './class.repository';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { Class, Schedule } from './class.domain';
import { Teacher } from 'modules/teachers/teacher.domain';
import { TeachersService } from 'modules/teachers/teachers.service';
import { StudentsService } from 'modules/students/students.service';
import { AddStudentsDto } from './dto/add-students.dto';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { Student } from 'modules/students/student.domain';
import { FilterStudentDto, SortStudentDto } from 'modules/students/dto/query-student.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ClsServiceManager } from 'nestjs-cls';

@Injectable()
export class ClassesService {
  constructor(
    private classRepository: ClassRepository,
    private teachersService: TeachersService,
    private studentsService: StudentsService,
    private i18nService: I18nService<I18nTranslations>,
    private auditLogService: AuditLogService
  ) { }
  create(createClassDto: CreateClassDto) {
    return this.classRepository.create(createClassDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterClassDto | null;
    sortOptions?: SortClassDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Class>> {
    return this.classRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  async findOne(id: Class['id']) {
    const result = await this.classRepository.findById(id);
    if (!result) throw new BadRequestException(this.i18nService.t('class.FAIL.NOT_FOUND'))
    return result
  }

  update(id: Class['id'], updateClassDto: UpdateClassDto) {
    return this.classRepository.update(id, updateClassDto);
  }


  async assignTeacherToClass(id: Class['id'], teacherId: Teacher['id']) {
    const teacher = await this.teachersService.findOne(teacherId)
    const result = await this.classRepository.assignTeacherToClass(id, teacher)
    if (!result) {
      throw new BadRequestException(
        this.i18nService.t('class.FAIL.TEACHER_ALREADY_ASSIGNED')
      )
    }
    return result
  }

  async unassignTeacherToClass(id: Class['id'], teacherId: Teacher['id']) {
    const teacher = await this.teachersService.findOne(teacherId)
    const result = await this.classRepository.unassignTeacherToClass(id, teacher)
    if (!result) {
      throw new BadRequestException(
        this.i18nService.t('class.FAIL.TEACHER_NOT_ASSIGNED')
      )
    }
    return result
  }

  async getAvailableToAddStudents(
    id: Class['id'],
    { filterOptions, sortOptions, paginationOptions }
      : { filterOptions: FilterStudentDto, sortOptions: SortStudentDto[], paginationOptions: IPaginationOptions }) {
    const students = await this.studentsService.findAll({ filterOptions, sortOptions, paginationOptions });
    const classSchedule = await this.classRepository.findById(id)

    return {
      students,
      classSchedule
    }
  }

  async addStudentsToClass(id: Class['id'], students: AddStudentsDto[], user: any) {
    const aclass = await this.classRepository.findById(id);
    const studentIds = students.map(item => item.studentId)
    const studenstList = await this.studentsService.findStudents(studentIds)

    //check schedule conflict of each student is passed
    for (const student of studenstList) {

      //check each class of a student
      for (const eachClass of student.classes) {
        if (eachClass.class.id === aclass.id)
          throw new BadRequestException(
            this.i18nService.t('class.FAIL.STUDENT_ALREADY_IN_CLASS')
          );

        //check date overlap. If no conflict, break
        if (!this.isDateOverlap(eachClass.class.schedule, aclass.schedule)) break;

        //check day of week overlap. If no conflict, break
        if (!this.isDayOverlap(eachClass.class.schedule, aclass.schedule)) break;

        //check time slots overlap. If no conflict, break
        if (!this.isTimeSlotOverlap(eachClass.class.schedule, aclass.schedule)) break;

        //if conflict found, return error
        throw new BadRequestException(
          this.i18nService.t('class.FAIL.SCHEDULE_CONFLICT', {
            args: {
              studentName: student.name,
              conflictClassName: eachClass.class.name,
              className: aclass.name
            }
          })
        )
      }
    }

    const method = ClsServiceManager.getClsService().get('method');
    const path = ClsServiceManager.getClsService().get('path');
    // this.auditLogService.track({
    //   user: user,
    //   entityName: 'ClassEntity',
    //   entityId: id,
    //   method,
    //   path,

    // })
    return await this.classRepository.addStudentsToClass(id, students)
  }

  async removeStudentsFromClass(id: Class['id'], students: Student['id'][]) {
    return this.classRepository.removeStudentsFromClass(id, students)
  }

  private isDateOverlap(schedule1: Schedule, schedule2: Schedule) {
    return schedule1.start_date <= schedule2.end_date && schedule2.start_date <= schedule1.end_date
  }

  private isDayOverlap(schedule1: Schedule, schedule2: Schedule) {
    for (const dayOfSchedule1 of schedule1.days_of_week) {
      const overlap = schedule2.days_of_week.find(item => dayOfSchedule1 === item)
      if (overlap) return true
    }
    return false
  }

  private isTimeSlotOverlap(schedule1: Schedule, schedule2: Schedule) {
    dayjs.extend(customParseFormat)
    const startTime1 = dayjs(schedule1.time_slots.start_time, "HH:mm");
    const endTime1 = dayjs(schedule1.time_slots.end_time, "HH:mm");

    const startTime2 = dayjs(schedule2.time_slots.start_time, "HH:mm");
    const endTime2 = dayjs(schedule2.time_slots.end_time, "HH:mm");


    return startTime1 <= endTime2 && startTime2 <= endTime1
  }
}
