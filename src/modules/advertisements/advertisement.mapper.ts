import { Injectable } from '@nestjs/common';
import { AdvertisementEntity } from './entities/advertisement.entity';
import { Advertisement } from './advertisement.domain';

@Injectable()
export class AdvertisementMapper {
  static toDomain(raw: AdvertisementEntity): Advertisement {
    const domainEntity = new Advertisement();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.type = raw.type;
    domainEntity.priority = raw.priority;
    domainEntity.imageUrl = raw.imageUrl;
    domainEntity.publicId = raw.publicId;
    domainEntity.classId = raw.classId;
    domainEntity.isActive = raw.isActive;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.class) {
      domainEntity.class = {
        id: raw.class.id,
        name: raw.class.name,
        grade: raw.class.grade,
        section: raw.class.section,
        year: raw.class.year,
        status: raw.class.status as 'active' | 'upcoming' | 'closed',
      };
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Advertisement): AdvertisementEntity {
    const persistenceEntity = new AdvertisementEntity();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.priority = domainEntity.priority;
    persistenceEntity.imageUrl = domainEntity.imageUrl;
    persistenceEntity.publicId = domainEntity.publicId;
    persistenceEntity.classId = domainEntity.classId;
    persistenceEntity.isActive = domainEntity.isActive ?? true;

    return persistenceEntity;
  }
}
