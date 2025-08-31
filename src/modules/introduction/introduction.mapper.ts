import { Injectable } from '@nestjs/common';
import { IntroductionEntity } from './entities/introduction.entity';
import { Introduction } from './introduction.domain';

@Injectable()
export class IntroductionMapper {
    static toDomain(raw: IntroductionEntity): Introduction {
        if (!raw) {
            return null;
        }

        const domainEntity = new Introduction();
        domainEntity.id = raw.id;
        domainEntity.key = raw.key;
        domainEntity.value = raw.value;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Introduction): IntroductionEntity {
        if (!domainEntity) {
            return null;
        }

        const persistenceEntity = new IntroductionEntity();
        if (domainEntity.id && typeof domainEntity.id === 'string') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.key = domainEntity.key;
        persistenceEntity.value = domainEntity.value;

        return persistenceEntity;
    }
}
