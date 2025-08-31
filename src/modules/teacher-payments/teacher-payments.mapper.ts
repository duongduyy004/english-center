import { TeacherPayment } from './teacher-payments.domain';
import { TeacherPaymentEntity } from './entities/teacher-payment.entity';
import { TeacherEntity } from 'modules/teachers/entities/teacher.entity';
import { ClassesService } from '../classes/classes.service';

export class TeacherPaymentMapper {
  static async toDomain(
    raw: TeacherPaymentEntity,
    classesService?: ClassesService,
  ): Promise<TeacherPayment> {
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
      raw.classes.length > 0 &&
      classesService
    ) {
      try {
        const classesData = await Promise.all(
          raw.classes.map(async (classLesson) => {
            try {
              const classInfo = await classesService.findOne(
                classLesson.classId,
              );
              return {
                totalLessons: classLesson.totalLessons || 0,
                id: classInfo.id,
                name: classInfo.name,
                grade: classInfo.grade,
                section: classInfo.section,
                year: classInfo.year,
              };
            } catch (error) {
              // Fallback if class not found
              return {
                totalLessons: classLesson.totalLessons || 0,
                id: classLesson.classId,
                name: 'Unknown Class',
                grade: 0,
                section: 0,
                year: new Date().getFullYear(),
              };
            }
          }),
        );
        teacherPayment.classes = classesData;
      } catch (error) {
        console.error('Error fetching class data:', error);
        teacherPayment.classes = [];
      }
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

  static async toDomainList(
    raws: TeacherPaymentEntity[],
    classesService?: ClassesService,
  ): Promise<TeacherPayment[]> {
    if (!raws || !Array.isArray(raws)) {
      return [];
    }
    return Promise.all(raws.map((raw) => this.toDomain(raw, classesService)));
  }
}
