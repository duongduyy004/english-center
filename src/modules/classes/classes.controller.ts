import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ResponseMessage } from '@/decorator/customize.decorator';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { Class } from './class.domain';
import { Teacher } from '../teachers/teacher.domain';
import { FilterStudentDto, SortStudentDto } from '../students/student.repository';
import { AddStudentsDto } from './dto/add-students.dto';
import { Student } from '../students/student.domain';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
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
  assignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.assignTeacherToClass(classId, teacherId)
  }

  @Patch('unassign-teacher')
  unassignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.unassignTeacherToClass(classId, teacherId)
  }


  @Get('available-students/:id')
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
  addStudentsToClass(@Param('id') id: Class['id'], @Body() students: AddStudentsDto[]) {
    return this.classesService.addStudentsToClass(id, students)
  }

  @Patch('remove-students/:id')
  removeStudentsFromClass(@Param('id') id: Class['id'], @Body() students: Student['id'][]) {
    return this.classesService.removeStudentsFromClass(id, students)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: Class['id'], @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }
}
