import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { FeedbackRepository } from './feedback.repository';
import { Feedback } from './feedback.domain';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';
import { FilterFeedbackDto, SortFeedbackDto } from './dto/query-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private feedbackRepository: FeedbackRepository,
    private i18nService: I18nService<I18nTranslations>
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackRepository.create(createFeedbackDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterFeedbackDto | null;
    sortOptions?: SortFeedbackDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Feedback>> {
    return this.feedbackRepository.findManyWithPagination({ filterOptions, sortOptions, paginationOptions });
  }

  async findOne(id: Feedback['id']): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findById(id);
    if (!feedback) throw new NotFoundException(this.i18nService.t('common.NOT_FOUND'));
    return feedback;
  }

  async update(id: Feedback['id'], updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    await this.findOne(id);
    return this.feedbackRepository.update(id, updateFeedbackDto);
  }

  async delete(id: Feedback['id']): Promise<void> {
    await this.findOne(id);
    return this.feedbackRepository.delete(id);
  }
}
