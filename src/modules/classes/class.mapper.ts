import { ClassEntity } from "./entities/class.entity";
import { Class } from "./class.domain";
import { TeacherMapper } from "@/modules/teachers/teacher.mapper";
import { TeacherEntity } from "@/modules/teachers/entities/teacher.entity";

export class ClassMapper {
    static toDomain(raw: ClassEntity): Class {
        const domainEntity = new Class();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.grade = raw.grade;
        domainEntity.section = raw.section;
        domainEntity.year = raw.year;
        domainEntity.description = raw.description;
        domainEntity.feePerLesson = raw.feePerLesson;
        domainEntity.status = raw.status as 'active' | 'upcoming' | 'closed';
        domainEntity.max_student = raw.max_student;
        domainEntity.room = raw.room;
        domainEntity.schedule = raw.schedule;
        if (raw.students) {
            domainEntity.students = raw.students.map(item => ({
                discountPercent: item?.discount_percent,
                student: {
                    id: item.student.id,
                    name: item.student.name,
                    email: item.student.email,
                    gender: item.student.gender,
                    phone: item.student.phone
                }
            }
            ))
        }
        if (raw.teacher) {
            domainEntity.teacher = {
                id: raw.teacher.id,
                name: raw.teacher.name,
                email: raw.teacher.email,
                phone: raw.teacher.phone
            }
        }
        return domainEntity;
    }

    static toPersistence(domainEntity: Class): ClassEntity {
        const persistenceEntity = new ClassEntity();
        if (domainEntity.id && typeof domainEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.name = domainEntity.name;
        persistenceEntity.grade = domainEntity.grade;
        persistenceEntity.section = domainEntity.section;
        persistenceEntity.year = domainEntity.year;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.feePerLesson = domainEntity.feePerLesson;
        persistenceEntity.status = domainEntity.status;
        persistenceEntity.max_student = domainEntity.max_student;
        persistenceEntity.room = domainEntity.room;
        persistenceEntity.schedule = domainEntity.schedule;
        return persistenceEntity;
    }
}