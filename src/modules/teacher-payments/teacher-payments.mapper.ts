import { isBuffer } from 'util';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { TeacherPayment } from './teacher-payments.domain';

export class TeacherPaymentMapper {
  static toDomain(raw: TeacherPaymentEntity): TeacherPayment {
    const domainEntity = new TeacherPayment();
    domainEntity.id = raw.id;
    domainEntity.month = raw.month;
    domainEntity.year = raw.year;
    domainEntity.totalAmount = raw.totalAmount;
    domainEntity.paidAmount = raw.paidAmount;
    domainEntity.status = raw.status as 'pending' | 'partial' | 'paid';
    domainEntity.teacherId = raw.teacherId;
    domainEntity.classes = raw.classes;
    if (raw.histories) {
      domainEntity.histories = raw.histories.map((item) => ({
        method: item.method,
        amount: item.amount,
        note: item.note,
        date: item.date,
      }));
    }
    if (raw.classes) {
      domainEntity.classes = raw.classes.map((item) => ({
        classId: item.classId,
        class: item.class,
        totalLessons: item.totalLessons,
      }));
    }
    return domainEntity;
  }
  static toPersistence(domainEntity: TeacherPayment) {
    const persistenceEntity = new TeacherPaymentEntity();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.month = domainEntity.month;
    persistenceEntity.year = domainEntity.year;
    persistenceEntity.totalAmount = domainEntity.totalAmount;
    persistenceEntity.paidAmount = domainEntity.paidAmount;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.teacherId = domainEntity.teacherId;
    
    if (domainEntity.classes) {
      persistenceEntity.classes = domainEntity.classes.map((item) => ({
        classId: item.classId,
        class: item.class,
        totalLessons: item.totalLessons,
      }));
    }

    return persistenceEntity;
  }
}
