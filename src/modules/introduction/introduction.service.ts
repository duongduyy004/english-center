import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { UpdateIntroductionDto } from './dto/update-introduction.dto';
import { IntroductionRepository } from './introduction.repository';
import { Introduction } from './introduction.domain';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { FilterIntroductionDto, SortIntroductionDto } from './dto/query-introduction.dto';

@Injectable()
export class IntroductionService {
  constructor(
    private introductionRepository: IntroductionRepository,
    private i18nService: I18nService<I18nTranslations>
  ) { }

  async create(createIntroductionDto: CreateIntroductionDto): Promise<Introduction> {
    // Check if key already exists
    const existingIntroduction = await this.introductionRepository.findByKey(createIntroductionDto.key);
    if (existingIntroduction) {
      throw new BadRequestException('Introduction with this key already exists');
    }

    return this.introductionRepository.create(createIntroductionDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterIntroductionDto | null;
    sortOptions?: SortIntroductionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Introduction>> {
    return this.introductionRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions });
  }

  async findOne(id: Introduction['id']): Promise<Introduction> {
    const introduction = await this.introductionRepository.findById(id);
    if (!introduction) throw new NotFoundException(this.i18nService.t('common.NOT_FOUND'));
    return introduction;
  }

  async findByKey(key: Introduction['key']): Promise<Introduction> {
    const introduction = await this.introductionRepository.findByKey(key);
    if (!introduction) throw new NotFoundException('Introduction with this key not found');
    return introduction;
  }

  async update(id: Introduction['id'], updateIntroductionDto: UpdateIntroductionDto): Promise<Introduction> {
    await this.findOne(id);

    // Check if key already exists for other records
    if (updateIntroductionDto.key) {
      const existingIntroduction = await this.introductionRepository.findByKey(updateIntroductionDto.key);
      if (existingIntroduction && existingIntroduction.id !== id) {
        throw new BadRequestException('Introduction with this key already exists');
      }
    }

    return this.introductionRepository.update(id, updateIntroductionDto);
  }

  async delete(id: Introduction['id']): Promise<void> {
    await this.findOne(id);
    return this.introductionRepository.delete(id);
  }
}
