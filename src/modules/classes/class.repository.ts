import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository, ILike, In } from 'typeorm';
import { ClassEntity } from './entities/class.entity';
import { Class } from './class.domain';
import { ClassMapper } from './class.mapper';
import { NullableType } from 'utils/types/nullable.type';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { Teacher } from 'modules/teachers/teacher.domain';
import { TeacherMapper } from '../teachers/teacher.mapper';
import { Student } from '../students/student.domain';
import { AddStudentsDto } from './dto/add-students.dto';
import { ClassStudentEntity } from './entities/class-student.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { AuditLogService } from 'modules/audit-log/audit-log.service';
import { ClsService } from 'nestjs-cls';
import { StudentsService } from 'modules/students/students.service';
import { AuditLogAction } from 'subscribers/audit-log.constants';

@Injectable()
export class ClassRepository {
  constructor(
    @InjectRepository(ClassEntity)
    private classRepository: Repository<ClassEntity>,
    @InjectRepository(ClassStudentEntity)
    private classStudentRepository: Repository<ClassStudentEntity>,
    private i18nService: I18nService<I18nTranslations>,
    private auditLogService: AuditLogService,
    private clsService: ClsService,
    private studentsService: StudentsService,
  ) {}

  async create(
    data: Omit<
      Class,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'teacher'
    >,
  ): Promise<Class> {
    const persistenceModel = ClassMapper.toPersistence(data as Class);
    const newEntity = await this.classRepository.save(
      this.classRepository.create(persistenceModel),
    );
    return ClassMapper.toDomain(newEntity);
  }

  async findAll(): Promise<Class[]> {
    const entities = await this.classRepository.find({
      relations: ['students', 'teacher'],
    });
    return entities.map((entity) => ClassMapper.toDomain(entity));
  }

  async findById(id: Class['id']): Promise<NullableType<Class>> {
    const entity = await this.classRepository.findOne({
      where: { id },
      relations: ['students.student', 'teacher'],
    });
    return entity ? ClassMapper.toDomain(entity) : null;
  }

  async findWithoutMapper(id: Class['id']) {
    const entity = await this.classRepository.findOne({
      where: { id },
      relations: ['students.student', 'teacher'],
    });
    return entity;
  }

  async update(
    id: Class['id'],
    data: Partial<
      Omit<Class, 'id' | 'createdAt' | 'updatedAt' | 'teacher' | 'students'>
    >,
  ): Promise<Class> {
    const entity = await this.classRepository.findOne({
      where: { id },
    });

    await this.classRepository.save({ ...entity, ...data });
    return ClassMapper.toDomain(entity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterClassDto | null;
    sortOptions?: SortClassDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Class>> {
    const where: FindOptionsWhere<ClassEntity> = {};

    // Apply filters
    if (filterOptions?.name) {
      where.name = ILike(`%${filterOptions.name}%`);
    }

    if (filterOptions?.grade) {
      where.grade = filterOptions.grade;
    }

    if (filterOptions?.section) {
      where.section = filterOptions.section;
    }

    if (filterOptions?.year) {
      where.year = filterOptions.year;
    }

    if (filterOptions?.status) {
      where.status = filterOptions.status;
    }

    if (filterOptions?.room) {
      where.room = ILike(`%${filterOptions.room}%`);
    }

    const [entities, total] = await this.classRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['students.student', 'teacher'],
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
    const totalItems = total;
    const totalPages = Math.ceil(totalItems / paginationOptions.limit);

    return {
      meta: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
        totalPages,
        totalItems,
      },
      result: entities.map((classEntity) => ClassMapper.toDomain(classEntity)),
    };
  }

  async assignTeacherToClass(
    id: Class['id'],
    teacher: Teacher,
  ): Promise<Class> {
    const entity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    //check if teacher was assgined to this class
    if (entity && entity.teacher && entity.teacher.id === teacher.id) {
      return null;
    }

    entity.teacher = TeacherMapper.toPersistence(teacher);
    await this.classRepository.save(entity);
    return ClassMapper.toDomain(entity);
  }

  async unassignTeacherToClass(
    id: Class['id'],
    teacher: Teacher,
  ): Promise<Class> {
    const entity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    //check if teacher was assgined to this class
    if (entity && entity.teacher && entity.teacher.id === teacher.id) {
      entity.teacher = null;
      this.classRepository.save(entity);
      return ClassMapper.toDomain(entity);
    }

    return null;
  }

  async addStudentsToClass(id: Class['id'], students: AddStudentsDto[]) {
    const studentsArray: ClassStudentEntity[] = [];
    for (const student of students) {
      studentsArray.push(
        this.classStudentRepository.create({
          classId: id,
          studentId: student.studentId,
          discountPercent: student.discountPercent,
        }),
      );
    }
    const classInfo = await this.classRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    classInfo.students = [...classInfo.students, ...studentsArray];
    await this.classRepository.save(classInfo, { listeners: false });
    this.auditAddStudents(students, id);
    return;
  }

  async removeStudentsFromClass(
    id: Class['id'],
    studentIds: Student['id'][],
  ): Promise<void> {
    await this.classStudentRepository.delete({
      studentId: In(studentIds),
      classId: id,
    });
    this.auditDeleteStudents(studentIds, id);
    return;
  }

  private async auditAddStudents(
    students: AddStudentsDto[],
    classId: Class['id'],
  ) {
    const currentUser = this.clsService.get('user');
    const method = this.clsService.get('method') || 'PUT';
    const path = this.clsService.get('path');

    const studentIds = students.map((item) => item.studentId);
    let studentsList = await this.studentsService.findStudents(studentIds);
    let addedStudents: {
      studentName: string;
      studentEmail: string;
      discountPercent: number;
    }[] = [];

    for (const student of students) {
      studentsList.map((item) => {
        if (item.id === student.studentId) {
          addedStudents.push({
            studentName: item.name,
            studentEmail: item.email,
            discountPercent: student.discountPercent,
          });
        }
      });
    }

    if (!currentUser) return; // Skip audit if no user context
    const classInfo = await this.findById(classId);

    const addedStudentsDescription = addedStudents
      .map(
        (item) =>
          `<li><strong>${item.studentName}</strong> - <em>${item.studentEmail}</em> <span style="color: green;">(giảm giá ${item.discountPercent}%)</span></li>`,
      )
      .join('');
    const description = `<strong>Thêm học sinh</strong> vào <strong>lớp ${classInfo.name} - ${classInfo.year}</strong> bởi <strong>${currentUser.name}</strong> - <em>${currentUser.email}</em>:<ul style="margin: 8px 0; padding-left: 20px;">${addedStudentsDescription}</ul>`;

    await this.auditLogService.track({
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role?.name || 'user',
      },
      entityName: 'ClassEntity',
      entityId: classId,
      path: path,
      method: method,
      action: AuditLogAction.UPDATE,
      changedFields: ['students'],
      oldValue: null,
      newValue: addedStudents.map((item) => ({
        studentName: item.studentName,
        studentEmail: item.studentEmail,
        discountPercent: item.discountPercent,
      })),
      description: description,
    });
  }

  private async auditDeleteStudents(
    studentIds: Student['id'][],
    classId: Class['id'],
  ) {
    const currentUser = this.clsService.get('user');
    const method = this.clsService.get('method') || 'PUT';
    const path = this.clsService.get('path');

    const studentsList = await this.studentsService.findStudents(studentIds);
    if (!currentUser) return; // Skip audit if no user context
    const classInfo = await this.findById(classId);

    const deletedStudentDescription = studentsList
      .map(
        (item) =>
          `<li><strong>${item.name}</strong> - <em>${item.email}</em></li>`,
      )
      .join('');
    const description = `<strong>Xóa học sinh</strong> khỏi <strong>lớp ${classInfo.name} - ${classInfo.year}</strong> bởi <strong>${currentUser.name}</strong> - <em>${currentUser.email}</em>:<ul style="margin: 8px 0; padding-left: 20px;">${deletedStudentDescription}</ul>`;

    await this.auditLogService.track({
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role?.name || 'user',
      },
      entityName: 'ClassEntity',
      entityId: classId,
      path: path,
      method: method,
      action: AuditLogAction.UPDATE,
      changedFields: ['students'],
      newValue: null,
      oldValue: studentsList.map((item) => ({
        studentName: item.name,
        studentEmail: item.email,
      })),
      description: description,
    });
  }

  async findClassesByTeacherId(teacherId: Teacher['id']): Promise<Class[]> {
    const entities = await this.classRepository.find({
      where: { teacher: { id: teacherId } },
      relations: ['students.student', 'teacher'],
    });
    return entities.map((entity) => ClassMapper.toDomain(entity));
  }

  async getInfoForBanner(id: Class['id']): Promise<Class> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });
    return ClassMapper.toDomain(classEntity);
  }
}
