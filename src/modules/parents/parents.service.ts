import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { FilterParentDto, ParentRepository, SortParentDto } from './parent.repository';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { UsersService } from '@/modules/users/users.service';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Parent } from './parent.domain';

@Injectable()
export class ParentsService {
  constructor(
    private parentRepository: ParentRepository,
    private userService: UsersService,
    private i18nSerivce: I18nService<I18nTranslations>
  ) { }

  async create(createParentDto: CreateParentDto) {
    const res = await this.userService.isEmailExist(createParentDto?.email)
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
      await this.userService.isEmailExist(updateParentDto.email)
    }
    return this.parentRepository.update(id, updateParentDto);
  }

  delete(id: Parent['id']) {
    return this.parentRepository.delete(id);
  }
}
