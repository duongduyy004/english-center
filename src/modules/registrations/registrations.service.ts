import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { RegistrationRepository } from './registration.repository';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Registration } from './registration.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class RegistrationsService {
  constructor(
    private registrationRepository: RegistrationRepository,
    private i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(data: CreateRegistrationDto) {
    return this.registrationRepository.create(data);
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any;
    sortOptions?: any;
    paginationOptions?: IPaginationOptions;
  }): Promise<PaginationResponseDto<Registration>> {
    return this.registrationRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne(id: Registration['id']) {
    const result = this.registrationRepository.findById(id);
    if (!result)
      throw new BadRequestException(
        this.i18nService.t('registration.FAIL.NOT_FOUND'),
      );
    return result;
  }

  async update(
    id: Registration['id'],
    updateRegistrationDto: UpdateRegistrationDto,
  ) {
    return this.registrationRepository.update(id, updateRegistrationDto);
  }

  async remove(id: Registration['id']) {
    return this.registrationRepository.remove(id);
  }
}
