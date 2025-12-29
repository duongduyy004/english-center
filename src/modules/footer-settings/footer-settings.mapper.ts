import { Injectable } from '@nestjs/common';
import { FooterSettingsEntity } from './entities/footer-settings.entity';
import { FooterSettings } from './footer-settings.domain';

@Injectable()
export class FooterSettingsMapper {
    static toDomain(raw: FooterSettingsEntity): FooterSettings {
        if (!raw) {
            return null;
        }

        const domainEntity = new FooterSettings();
        domainEntity.id = raw.id;
        domainEntity.key = raw.key;
        domainEntity.companyName = raw.companyName;
        domainEntity.email = raw.email;
        domainEntity.phone = raw.phone;
        domainEntity.address = raw.address;
        domainEntity.description = raw.description;
        domainEntity.facebookUrl = raw.facebookUrl;
        domainEntity.youtubeUrl = raw.youtubeUrl;
        domainEntity.zaloUrl = raw.zaloUrl;
        domainEntity.mapEmbedUrl = raw.mapEmbedUrl;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: FooterSettings): FooterSettingsEntity {
        if (!domainEntity) {
            return null;
        }

        const persistenceEntity = new FooterSettingsEntity();
        if (domainEntity.id && typeof domainEntity.id === 'string') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.key = domainEntity.key || 'default';
        persistenceEntity.companyName = domainEntity.companyName;
        persistenceEntity.email = domainEntity.email;
        persistenceEntity.phone = domainEntity.phone;
        persistenceEntity.address = domainEntity.address;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.facebookUrl = domainEntity.facebookUrl;
        persistenceEntity.youtubeUrl = domainEntity.youtubeUrl;
        persistenceEntity.zaloUrl = domainEntity.zaloUrl;
        persistenceEntity.mapEmbedUrl = domainEntity.mapEmbedUrl;

        return persistenceEntity;
    }
}

