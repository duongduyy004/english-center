import { Injectable } from '@nestjs/common';
import { TeacherEntity } from "./entities/teacher.entity";
import { Teacher } from "./teacher.domain";
import { ClassMapper } from '@/modules/classes/class.mapper';
import { ClassEntity } from '../classes/entities/class.entity';

@Injectable()
export class TeacherMapper {
    static toDomain(raw: TeacherEntity): Teacher {
        const domainEntity = new Teacher();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.email = raw.email;
        domainEntity.password = raw.password;
        domainEntity.gender = raw.gender;
        domainEntity.dayOfBirth = raw.dayOfBirth;
        domainEntity.address = raw.address;
        domainEntity.phone = raw.phone;
        domainEntity.avatar = raw.avatar;
        domainEntity.qualifications = raw.qualifications;
        domainEntity.specializations = raw.specializations;
        domainEntity.description = raw.description;
        domainEntity.salaryPerLesson = raw.salaryPerLesson;
        domainEntity.isActive = raw.isActive;
        if (raw.classes) {
            domainEntity.classes = raw.classes.map(aclass => ClassMapper.toDomain(aclass))
        }
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Teacher): TeacherEntity {
        let classes: ClassEntity[] | undefined | null = undefined
        if (domainEntity.classes) {
            classes = domainEntity.classes.map(aclass => ClassMapper.toPersistence(aclass))
        }
        const persistenceEntity = new TeacherEntity();
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
        persistenceEntity.qualifications = domainEntity.qualifications;
        persistenceEntity.specializations = domainEntity.specializations;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.isActive = domainEntity.isActive;
        persistenceEntity.salaryPerLesson = domainEntity.salaryPerLesson;
        persistenceEntity.classes = classes
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;
        persistenceEntity.deletedAt = domainEntity.deletedAt;

        return persistenceEntity;
    }
}