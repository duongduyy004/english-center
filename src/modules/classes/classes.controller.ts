import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { QueryDto } from 'utils/types/query.dto';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { Class } from './class.domain';
import { Teacher } from 'modules/teachers/teacher.domain';
import { AddStudentsDto } from './dto/add-students.dto';
import { Student } from '../students/student.domain';
import { FilterStudentDto, SortStudentDto } from 'modules/students/dto/query-student.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  @ResponseMessage('class.SUCCESS.CREATE_A_CLASS')
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ResponseMessage('class.SUCCESS.GET_CLASS_PAGINATION')
  findAll(@Query() query: QueryDto<FilterClassDto, SortClassDto>) {
    const page = query?.page;
    const limit = query?.limit;
    return this.classesService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        page,
        limit
      }
    });
  }

  @Patch('assign-teacher')
  @ResponseMessage('class.SUCCESS.ASSIGN_TEACHER')
  assignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.assignTeacherToClass(classId, teacherId)
  }

  @Patch('unassign-teacher')
  @ResponseMessage('class.SUCCESS.UNASSIGN_TEACHER')
  unassignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.unassignTeacherToClass(classId, teacherId)
  }


  @Get('available-students/:id')
  @ResponseMessage('class.SUCCESS.GET_AVAILABLE_STUDENTS')
  getAvailableToAddStudents(
    @Query('id') id: Class['id'],
    @Query() query: QueryDto<FilterStudentDto, SortStudentDto>
  ) {
    const page = query?.page;
    const limit = query?.limit;
    return this.classesService.getAvailableToAddStudents(id, {
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        limit, page
      }
    })
  }

  @Patch('add-students/:id')
  @ResponseMessage('class.SUCCESS.ADD_STUDENTS')
  addStudentsToClass(@Param('id') id: Class['id'], @Body() students: AddStudentsDto[]) {
    return this.classesService.addStudentsToClass(id, students)
  }

  @Patch('remove-students/:id')
  @ResponseMessage('class.SUCCESS.REMOVE_STUDENTS')
  removeStudentsFromClass(@Param('id') id: Class['id'], @Body() students: Student['id'][]) {
    return this.classesService.removeStudentsFromClass(id, students)
  }

  @Patch('student-status/:id')
  updateStudentStatus(
    @Body('isActive') isActive: boolean,
    @Query('studentId') studentId: string,
    @Param('id') classId: string
  ) {
    return this.classesService.updateStudentStatus(studentId, classId, isActive);
  }

  @Get(':id')
  @ResponseMessage('class.SUCCESS.GET_A_CLASS')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('class.SUCCESS.UPDATE_A_CLASS')
  update(@Param('id') id: Class['id'], @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }
}
