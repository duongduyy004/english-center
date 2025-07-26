import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudentDto, SortStudentDto, StudentRepository } from './student.repository';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Student } from './student.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentsService {
  constructor(
    private studentRepository: StudentRepository,
    private userService: UsersService,
    private i18nSerivce: I18nService<I18nTranslations>
  ) { }
  async create(createStudentDto: CreateStudentDto) {
    this.userService.isEmailExist(createStudentDto?.email)
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
    if (!student) throw new NotFoundException(this.i18nSerivce.t('student.FAIL.NOT_FOUND'))
    return student
  }

  async update(id: Student['id'], updateStudentDto: UpdateStudentDto) {
    if (updateStudentDto && updateStudentDto.email) {
      this.userService.isEmailExist(updateStudentDto?.email)
    }
    return this.studentRepository.update(id, updateStudentDto);
  }

  delete(id: Student['id']) {
    return this.studentRepository.delete(id);
  }
}
