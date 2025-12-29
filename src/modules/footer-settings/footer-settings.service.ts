import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFooterSettingsDto } from './dto/create-footer-settings.dto';
import { UpdateFooterSettingsDto } from './dto/update-footer-settings.dto';
import { FooterSettingsRepository } from './footer-settings.repository';
import { FooterSettings } from './footer-settings.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class FooterSettingsService {
    constructor(
        private footerSettingsRepository: FooterSettingsRepository,
        private i18nService: I18nService<I18nTranslations>
    ) { }

    async findOne(): Promise<FooterSettings> {
        const settings = await this.footerSettingsRepository.findOne();
        if (!settings) {
            throw new NotFoundException(this.i18nService.t('common.NOT_FOUND'));
        }
        return settings;
    }

    async create(createFooterSettingsDto: CreateFooterSettingsDto): Promise<FooterSettings> {
        return this.footerSettingsRepository.create({
            ...createFooterSettingsDto,
            key: 'default'
        });
    }

    async update(updateFooterSettingsDto: UpdateFooterSettingsDto): Promise<FooterSettings> {
        return this.footerSettingsRepository.update(updateFooterSettingsDto);
    }
}

