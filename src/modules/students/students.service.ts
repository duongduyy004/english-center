import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Student } from './student.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { UsersService } from '@/modules/users/users.service';
import { FilterStudentDto, SortStudentDto } from './dto/query-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private studentRepository: StudentRepository,
    private usersService: UsersService,
    private i18nSerivce: I18nService<I18nTranslations>
  ) { }
  async create(createStudentDto: CreateStudentDto) {
    await this.usersService.isEmailExist(createStudentDto?.email)
    return this.studentRepository.create(createStudentDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterStudentDto | null;
    sortOptions?: SortStudentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Student>> {
    return this.studentRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  async findOne(id: Student['id']) {
    const student = await this.studentRepository.findById(id)
    if (!student) throw new NotFoundException(this.i18nSerivce.t('user.FAIL.NOT_FOUND'))
    return student
  }

  async update(id: Student['id'], updateStudentDto: UpdateStudentDto) {
    if (updateStudentDto && updateStudentDto.email) {
      this.usersService.isEmailExist(updateStudentDto?.email)
    }
    return this.studentRepository.update(id, updateStudentDto);
  }

  async delete(id: Student['id']) {
    await this.findOne(id)
    return this.studentRepository.delete(id);
  }

  async findStudents(ids: Student['id'][]) {
    return await this.studentRepository.findStudents(ids)
  }

  async getSchedule(id: Student['id']) {
    return this.studentRepository.getSchedule(id)
  }
}
