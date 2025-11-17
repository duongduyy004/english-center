import { TeacherPayment } from './teacher-payments.domain';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';

export class TeacherPaymentMapper {
  static toDomain(
    raw: TeacherPaymentEntity,
  ): TeacherPayment {
    const teacherPayment = new TeacherPayment();

    teacherPayment.id = raw.id;
    teacherPayment.month = raw.month;
    teacherPayment.year = raw.year;
    teacherPayment.totalAmount = raw.totalAmount;
    teacherPayment.paidAmount = raw.paidAmount;
    teacherPayment.status = raw.status;

    if (raw.teacher) {
      teacherPayment.teacher = {
        id: raw.teacher.id,
        name: raw.teacher.name,
        email: raw.teacher.email,
        phone: raw.teacher.phone,
        salaryPerLesson: raw.teacher.salaryPerLesson,
      };
    }

    teacherPayment.classes = [];
    if (
      raw.classes &&
      Array.isArray(raw.classes) &&
      raw.classes.length > 0
    ) {

      teacherPayment.classes = raw.classes.map(item => ({
        totalLessons: item.totalLessons,
        id: item.class.id,
        name: item.class.name,
        grade: item.class.grade,
        year: item.class.year,
        section: item.class.section,
        feePerLesson: item.class.feePerLesson
      }));

    }

    teacherPayment.histories = [];
    if (
      raw.histories &&
      Array.isArray(raw.histories) &&
      raw.histories.length > 0
    ) {
      const validHistories = raw.histories.filter(
        (history) =>
          history &&
          history.method &&
          history.method.trim() !== '' &&
          history.amount > 0,
      );

      if (validHistories.length > 0) {
        teacherPayment.histories = validHistories.map((history) => ({
          method: history.method,
          amount: history.amount,
          note: history.note || '',
          date: history.date || new Date(),
        }));
      }
    }

    return teacherPayment;
  }

}
