import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import {
  FilterParentDto,
  ParentRepository,
  SortParentDto,
} from './parent.repository';
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
    private studentService: StudentsService,
  ) {}

  async create(createParentDto: CreateParentDto) {
    const emailExists = await this.usersService.isEmailExist(
      createParentDto?.email,
    );
    if (emailExists) {
      throw new BadRequestException(
        this.i18nSerivce.t('parent.FAIL.EMAIL_EXIST'),
      );
    }
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
    return this.parentRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: Parent['id']) {
    const parent = await this.parentRepository.findById(id);
    if (!parent)
      throw new NotFoundException(this.i18nSerivce.t('parent.FAIL.NOT_FOUND'));
    return parent;
  }

  async update(id: Parent['id'], updateParentDto: UpdateParentDto) {
    const existing = await this.parentRepository.findById(id);
    if (!existing)
      throw new NotFoundException(this.i18nSerivce.t('parent.FAIL.NOT_FOUND'));

    if (updateParentDto && updateParentDto.email) {
      const emailExists = await this.usersService.isEmailExist(
        updateParentDto.email,
      );
      if (emailExists) {
        throw new BadRequestException(
          this.i18nSerivce.t('parent.FAIL.EMAIL_EXIST'),
        );
      }
    }
    return this.parentRepository.update(id, updateParentDto);
  }

  async delete(id: Parent['id']) {
    const existing = await this.parentRepository.findById(id);
    if (!existing)
      throw new NotFoundException(this.i18nSerivce.t('parent.FAIL.NOT_FOUND'));
    return this.parentRepository.delete(id);
  }

  async addChild(studentId: Student['id'], parentId: Parent['id']) {
    const parent = await this.parentRepository.findById(parentId);
    if (!parent)
      throw new NotFoundException(this.i18nSerivce.t('parent.FAIL.NOT_FOUND'));

    const student = await this.studentService.findOne(studentId);
    if (student.parent) {
      throw new BadRequestException(
        this.i18nSerivce.t('parent.FAIL.STUDENT_ALREADY_HAS_PARENT'),
      );
    }

    const result = await this.parentRepository.addChild(student, parentId);
    if (!result)
      throw new BadRequestException(
        this.i18nSerivce.t('parent.FAIL.CHILD_ALREADY_EXISTS'),
      );
    return result;
  }

  async removeChild(studentId: Student['id'], parentId: Parent['id']) {
    const parent = await this.parentRepository.findById(parentId);
    if (!parent)
      throw new NotFoundException(this.i18nSerivce.t('parent.FAIL.NOT_FOUND'));

    const exists = Array.isArray(parent.students)
      ? parent.students.some((s) => String(s.id) === String(studentId))
      : false;
    if (!exists) {
      throw new BadRequestException(
        this.i18nSerivce.t('parent.FAIL.CHILD_NOT_FOUND'),
      );
    }

    return this.parentRepository.removeChild(studentId, parentId);
  }
}
