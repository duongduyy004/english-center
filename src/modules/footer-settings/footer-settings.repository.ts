import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FooterSettingsEntity } from './entities/footer-settings.entity';
import { FooterSettings } from './footer-settings.domain';
import { FooterSettingsMapper } from './footer-settings.mapper';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class FooterSettingsRepository {
    constructor(
        @InjectRepository(FooterSettingsEntity) 
        private footerSettingsRepository: Repository<FooterSettingsEntity>
    ) { }

    async findOne(): Promise<NullableType<FooterSettings>> {
        const entity = await this.footerSettingsRepository.findOne({
            where: { key: 'default' }
        });
        return entity ? FooterSettingsMapper.toDomain(entity) : null;
    }

    async create(data: Omit<FooterSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<FooterSettings> {
        const existing = await this.findOne();
        if (existing) {
            throw new Error('Footer settings already exist. Use update instead.');
        }

        const persistenceModel = FooterSettingsMapper.toPersistence({
            ...data,
            key: 'default'
        } as FooterSettings);
        
        const newEntity = await this.footerSettingsRepository.save(
            this.footerSettingsRepository.create(persistenceModel)
        );
        return FooterSettingsMapper.toDomain(newEntity);
    }

    async update(payload: Partial<Omit<FooterSettings, 'id' | 'key' | 'createdAt' | 'updatedAt'>>): Promise<FooterSettings> {
        const entity = await this.footerSettingsRepository.findOne({
            where: { key: 'default' }
        });

        if (!entity) {
            throw new Error('Footer settings not found. Please create it first.');
        }

        await this.footerSettingsRepository.save({ ...entity, ...payload });

        const updatedEntity = await this.footerSettingsRepository.findOne({
            where: { key: 'default' }
        });

        return FooterSettingsMapper.toDomain(updatedEntity!);
    }
}

