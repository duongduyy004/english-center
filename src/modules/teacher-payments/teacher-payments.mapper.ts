import { TeacherPayment } from "./teacher-payments.domain";
import { TeacherPaymentEntity } from "./entities/teacher-payment.entity";

export class TeacherPaymentMapper {
  static toDomain(raw: TeacherPaymentEntity): TeacherPayment {
    const domainEntity = new TeacherPayment();

    domainEntity.id = raw.id;
    domainEntity.month = raw.month;
    domainEntity.year = raw.year;
    domainEntity.totalAmount = raw.totalAmount;
    domainEntity.paidAmount = raw.paidAmount;
    domainEntity.status = raw.status;

    // Map teacher information
    if (raw.teacher) {
      domainEntity.teacher = {
        id: raw.teacher.id,
        name: raw.teacher.name,
        email: raw.teacher.email,
        phone: raw.teacher.phone
      };
    }

    // Map classes information
    if (raw.classes && Array.isArray(raw.classes)) {
      domainEntity.classes = raw.classes.map(classItem => ({
        totalLessons: classItem.totalLessons,
        id: classItem.class?.id || classItem.classId,
        name: classItem.class?.name || '',
        grade: classItem.class?.grade || 0,
        section: classItem.class?.section || 0,
        year: classItem.class?.year || 0
      }));
    } else {
      domainEntity.classes = [];
    }

    // Map payment histories
    if (raw.histories && Array.isArray(raw.histories)) {
      domainEntity.histories = raw.histories.map(history => ({
        method: history.method,
        amount: history.amount,
        note: history.note,
        date: history.date
      }));
    } else {
      domainEntity.histories = [];
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: TeacherPayment): TeacherPaymentEntity {
    const persistenceEntity = new TeacherPaymentEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.month = domainEntity.month;
    persistenceEntity.year = domainEntity.year;
    persistenceEntity.totalAmount = domainEntity.totalAmount;
    persistenceEntity.paidAmount = domainEntity.paidAmount;
    persistenceEntity.status = domainEntity.status;

    // Map teacher ID
    if (domainEntity.teacher) {
      persistenceEntity.teacherId = domainEntity.teacher.id;
    }

    // Map classes to JSONB format
    if (domainEntity.classes && Array.isArray(domainEntity.classes)) {
      persistenceEntity.classes = domainEntity.classes.map(classItem => ({
        classId: classItem.id,
        totalLessons: classItem.totalLessons,
        class: {
          id: classItem.id,
          name: classItem.name,
          grade: classItem.grade,
          section: classItem.section,
          year: classItem.year
        }
      } as any));
    } else {
      persistenceEntity.classes = [];
    }

    // Map payment histories to JSONB format
    if (domainEntity.histories && Array.isArray(domainEntity.histories)) {
      persistenceEntity.histories = domainEntity.histories.map(history => ({
        method: history.method,
        amount: history.amount,
        note: history.note,
        date: history.date
      }));
    } else {
      persistenceEntity.histories = [];
    }

    return persistenceEntity;
  }
}