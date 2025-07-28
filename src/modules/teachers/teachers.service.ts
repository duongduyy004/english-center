import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { FilterTeacherDto, SortTeacherDto, TeacherRepository } from './teacher.repository';
import { UsersService } from '@/modules/users/users.service';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Teacher } from './teacher.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class TeachersService {
  constructor(
    private teacherRepository: TeacherRepository,
    private usersService: UsersService,
    private i18nService: I18nService<I18nTranslations>
  ) { }
  async create(createTeacherDto: CreateTeacherDto) {
    await this.usersService.isEmailExist(createTeacherDto.email)
    return this.teacherRepository.create(createTeacherDto);
  }


  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTeacherDto | null;
    sortOptions?: SortTeacherDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Teacher>> {
    return this.teacherRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions })
  }

  async findOne(id: Teacher['id']) {
    const teacher = await this.teacherRepository.findById(id)
    if (!teacher) throw new NotFoundException(this.i18nService.t('user.FAIL.NOT_FOUND'))
    return teacher;
  }

  async update(id: Teacher['id'], updateTeacherDto: UpdateTeacherDto) {
    await this.findOne(id)
    if (updateTeacherDto && updateTeacherDto.email) {
      this.usersService.isEmailExist(updateTeacherDto.email)
    }
    return this.teacherRepository.update(id, updateTeacherDto)
  }

  async delete(id: Teacher['id']) {
    await this.findOne(id)
    return this.teacherRepository.delete(id);
  }
}
