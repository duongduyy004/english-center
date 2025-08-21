import { Injectable } from '@nestjs/common';
import { RegistrationEntity } from './entities/registration.entity';
import { Registration } from './registration.domain';
import { ClassEntity } from '../classes/entities/class.entity';

@Injectable()
export class RegistrationMapper {
  static toDomain(raw: RegistrationEntity): Registration {
    const domainEntity = new Registration();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.name = raw.name;
    domainEntity.phone = raw.phone;
    domainEntity.gender = raw.gender;
    domainEntity.address = raw.address;
    domainEntity.note = raw.note;
    domainEntity.processed = raw.processed;
    domainEntity.class = {
      id: raw.class.id,
      name: raw.class.name,
      grade: raw.class.grade,
      section: raw.class.section,
      year: raw.class.year,
      description: raw.class.description,
      feePerLesson: raw.class.feePerLesson,
      status: raw.class.status as 'active' | 'upcoming' | 'closed',
      max_student: raw.class.max_student,
      room: raw.class.room,
      schedule: raw.class.schedule,
    };
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Registration): RegistrationEntity {
    const persistenceEntity = new RegistrationEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.phone = domainEntity.phone;
    persistenceEntity.gender = domainEntity.gender;
    persistenceEntity.address = domainEntity.address;
    persistenceEntity.note = domainEntity.note;
    persistenceEntity.processed = domainEntity.processed;

    // Gán classId và class object
    if (domainEntity.class) {
      persistenceEntity.classId = domainEntity.class.id;
      const classEntity = new ClassEntity();
      classEntity.id = domainEntity.class.id;
      persistenceEntity.class = classEntity;
    }

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
