import { Injectable } from '@nestjs/common';
import { StudentEntity } from "./entities/student.entity";
import { Student } from "./student.domain";
import { RoleEnum } from 'modules/roles/roles.enum';

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
        domainEntity.role = {
            id: raw.role.id,
            name: RoleEnum[raw.role.id]
        }
        if (raw.classes) {
            domainEntity.classes = raw.classes.map(item => ({
                discountPercent: item.discount_percent,
                class: {
                    id: item.class.id,
                    name: item.class.name,
                    grade: item.class.grade,
                    section: item.class.section,
                    schedule: item.class.schedule
                }
            }))
        }
        if (raw.parent) {
            domainEntity.parent = {
                id: raw.parent.id,
                name: raw.parent.name,
                email: raw.parent.email,
                phone: raw.parent.phone
            }
        }

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
        persistenceEntity.role = {
            id: domainEntity.role.id,
            name: domainEntity.role.name
        }

        return persistenceEntity;
    }
}