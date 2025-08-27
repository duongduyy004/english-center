import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { CheckPolicies, ResponseMessage, User } from '@/decorator/customize.decorator';
import { QueryDto } from 'utils/types/query.dto';
import { FilterClassDto, SortClassDto } from './dto/query-class.dto';
import { Class } from './class.domain';
import { Teacher } from 'modules/teachers/teacher.domain';
import { AddStudentsDto } from './dto/add-students.dto';
import { Student } from '../students/student.domain';
import { FilterStudentDto, SortStudentDto } from 'modules/students/dto/query-student.dto';
import { AppAbility } from 'modules/casl/casl-ability.factory/casl-ability.factory';
import { Actions } from '@/utils/constants';
import { ClassEntity } from './entities/class.entity';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Create, ClassEntity))
  @ResponseMessage('class.SUCCESS.CREATE_A_CLASS')
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Manage, ClassEntity))
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
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, ClassEntity))
  assignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.assignTeacherToClass(classId, teacherId)
  }

  @Patch('unassign-teacher')
  @ResponseMessage('class.SUCCESS.UNASSIGN_TEACHER')
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, ClassEntity))
  unassignTeacherToClass(
    @Query('classId') classId: Class['id'],
    @Query('teacherId') teacherId: Teacher['id']
  ) {
    return this.classesService.unassignTeacherToClass(classId, teacherId)
  }


  @Get('available-students/:id')
  @ResponseMessage('class.SUCCESS.GET_AVAILABLE_STUDENTS')
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, ClassEntity))
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
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, ClassEntity))
  addStudentsToClass(@Param('id') id: Class['id'], @Body() students: AddStudentsDto[]) {
    return this.classesService.addStudentsToClass(id, students)
  }

  @Patch('remove-students/:id')
  @ResponseMessage('class.SUCCESS.REMOVE_STUDENTS')
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, ClassEntity))
  removeStudentsFromClass(@Param('id') id: Class['id'], @Body() students: Student['id'][]) {
    return this.classesService.removeStudentsFromClass(id, students)
  }

  @Get(':id')
  @ResponseMessage('class.SUCCESS.GET_A_CLASS')
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Read, ClassEntity))
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('class.SUCCESS.UPDATE_A_CLASS')
  @CheckPolicies((ability: AppAbility) => ability.can(Actions.Update, ClassEntity))
  update(@Param('id') id: Class['id'], @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }
}
