import { Injectable } from '@nestjs/common';
import { StudentEntity } from "./entities/student.entity";
import { Student } from "./student.domain";

@Injectable()
export class StudentMapper {
    static toDomain(raw: StudentEntity): Student {
        const domainEntity = new Student();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.email = raw.email;
        domainEntity.password = raw.password;
        domainEntity.gender = raw.gender;
        domainEntity.dayOfBirth = raw.dayOfBirth;
        domainEntity.address = raw.address;
        domainEntity.phone = raw.phone;
        domainEntity.avatar = raw.avatar;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Student): StudentEntity {
        const persistenceEntity = new StudentEntity();
        if (domainEntity.id && typeof domainEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.name = domainEntity.name;
        persistenceEntity.email = domainEntity.email;
        persistenceEntity.password = domainEntity.password;
        persistenceEntity.gender = domainEntity.gender;
        persistenceEntity.dayOfBirth = domainEntity.dayOfBirth;
        persistenceEntity.address = domainEntity.address;
        persistenceEntity.phone = domainEntity.phone;
        persistenceEntity.avatar = domainEntity.avatar;
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;
        persistenceEntity.deletedAt = domainEntity.deletedAt;

        return persistenceEntity;
    }
}