import { Injectable } from '@nestjs/common';
import { NotificationEntity } from './entities/notification.entity';
import { Notification } from './notification.domain';

@Injectable()
export class NotificationMapper {
    static toDomain(raw: NotificationEntity): Notification {
        const domainEntity = new Notification();

        domainEntity.id = raw.id;
        domainEntity.recipientId = raw.recipientId;
        domainEntity.isRead = raw.isRead;
        domainEntity.createdAt = raw.createdAt;

        if (raw.object) {
            domainEntity.object = {
                id: raw.object.id,
                actorId: raw.object.actorId,
                data: raw.object.data,
                createdAt: raw.object.createdAt,
            };
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: Notification): NotificationEntity {
        const persistenceEntity = new NotificationEntity();

        if (domainEntity.id && typeof domainEntity.id === 'string') {
            persistenceEntity.id = domainEntity.id;
        }

        persistenceEntity.recipientId = domainEntity.recipientId;
        persistenceEntity.isRead = domainEntity.isRead;

        return persistenceEntity;
    }
}
