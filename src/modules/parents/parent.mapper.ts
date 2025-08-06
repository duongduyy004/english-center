import { ParentEntity } from "@/modules/Parents/entities/Parent.entity";
import { Parent } from "@/modules/parents/Parent.domain";
import { StudentMapper } from "../students/student.mapper";
import { Student } from "../students/student.domain";
import { StudentEntity } from "../students/entities/student.entity";

export class ParentMapper {
    static toDomain(raw: ParentEntity): Parent {
        const domainEntity = new Parent();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.email = raw.email;
        domainEntity.password = raw.password;
        domainEntity.gender = raw.gender;
        domainEntity.dayOfBirth = raw.dayOfBirth;
        domainEntity.address = raw.address;
        domainEntity.phone = raw.phone;
        domainEntity.avatar = raw.avatar;
        if (raw.students) {
            domainEntity.students = raw.students.map(item => ({
                id: item.id,
                name: item.name,
                email: item.email,
                phone: item.phone
            }))
        }
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        domainEntity.deletedAt = raw.deletedAt;
        return domainEntity;
    }

    static toPersistence(domainEntity: Parent): ParentEntity {
        const persistenceEntity = new ParentEntity();
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