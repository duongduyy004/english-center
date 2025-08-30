import { Injectable } from '@nestjs/common';
import { FeedbackEntity } from './entities/feedback.entity';
import { Feedback } from './feedback.domain';

@Injectable()
export class FeedbackMapper {
    static toDomain(raw: FeedbackEntity): Feedback {
        const domainEntity = new Feedback();
        domainEntity.id = raw.id;
        domainEntity.imageUrl = raw.imageUrl;
        domainEntity.publicId = raw.publicId;
        domainEntity.description = raw.description;
        domainEntity.socialUrl = raw.socialUrl;
        domainEntity.name = raw.name;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Feedback): FeedbackEntity {
        if (!domainEntity) {
            return null;
        }

        const persistenceEntity = new FeedbackEntity();
        if (domainEntity.id && typeof domainEntity.id === 'string') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.imageUrl = domainEntity.imageUrl;
        persistenceEntity.publicId = domainEntity.publicId;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.socialUrl = domainEntity.socialUrl;
        persistenceEntity.name = domainEntity.name;

        return persistenceEntity;
    }
}
