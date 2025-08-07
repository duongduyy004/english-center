import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { FilterParentDto, ParentRepository, SortParentDto } from './parent.repository';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { UsersService } from 'modules/users/users.service';
import { IPaginationOptions } from 'utils/types/pagination-options';
import { PaginationResponseDto } from 'utils/types/pagination-response.dto';
import { Parent } from './parent.domain';
import { Student } from 'modules/students/student.domain';
import { StudentsService } from 'modules/students/students.service';

@Injectable()
export class ParentsService {
  constructor(
    private parentRepository: ParentRepository,
    private usersService: UsersService,
    private i18nSerivce: I18nService<I18nTranslations>,
    private studentService: StudentsService
  ) { }

  async create(createParentDto: CreateParentDto) {
    const res = await this.usersService.isEmailExist(createParentDto?.email)
    return this.parentRepository.create(createParentDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterParentDto | null;
    sortOptions?: SortParentDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Parent>> {
    return this.parentRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  async findOne(id: Parent['id']) {
    const parent = await this.parentRepository.findById(id)
    if (!parent) throw new BadRequestException(this.i18nSerivce.t('user.FAIL.NOT_FOUND'))
    return parent;
  }

  async update(id: Parent['id'], updateParentDto: UpdateParentDto) {
    if (updateParentDto && updateParentDto.email) {
      await this.usersService.isEmailExist(updateParentDto.email)
    }
    return this.parentRepository.update(id, updateParentDto);
  }

  delete(id: Parent['id']) {
    return this.parentRepository.delete(id);
  }

  async addChild(studentId: Student['id'], parentId: Parent['id']) {
    const student = await this.studentService.findOne(studentId)
    if (student.parent) {
      return student
    }

    const result = await this.parentRepository.addChild(student, parentId);
    if (!result) throw new BadRequestException('Child already exist')
    return result
  }

  async removeChild(studentId: Student['id'], parentId: Parent['id']) {
    return this.parentRepository.removeChild(studentId, parentId)
  }
}
