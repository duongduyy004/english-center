import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { AdvertisementRepository } from './advertisement.repository';
import { Advertisement } from './advertisement.domain';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class AdvertisementsService {
  constructor(
    private advertisementRepository: AdvertisementRepository,
    private i18nService: I18nService<I18nTranslations>
  ) { }

  async create(createAdvertisementDto: CreateAdvertisementDto): Promise<Advertisement> {
    return this.advertisementRepository.create(createAdvertisementDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any | null;
    sortOptions?: any[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Advertisement>> {
    return this.advertisementRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions });
  }

  async findOne(id: Advertisement['id']): Promise<Advertisement> {
    const advertisement = await this.advertisementRepository.findById(id);
    if (!advertisement) throw new NotFoundException(this.i18nService.t('common.NOT_FOUND'));
    return advertisement;
  }

  async update(id: Advertisement['id'], updateAdvertisementDto: UpdateAdvertisementDto): Promise<Advertisement> {
    await this.findOne(id);
    return this.advertisementRepository.update(id, updateAdvertisementDto);
  }

  async delete(id: Advertisement['id']): Promise<void> {
    await this.findOne(id);
    return this.advertisementRepository.delete(id);
  }
}
