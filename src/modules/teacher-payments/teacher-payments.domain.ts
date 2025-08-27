import { Class } from '../classes/class.domain';
import { Histories } from '../payments/entities/payment.entity';
import { Teacher } from '../teachers/teacher.domain';
import { ClassLessons } from './entities/teacher-payment.entity';

export class TeacherPayment {
  id: string;
  month: number;
  year: number;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'partial' | 'paid';
  teacherId: Teacher['id'];
  classes: {
    classId: Class['id'];
    class: Partial<Class>;
    totalLessons: number;
  }[];
  histories: {
    method: string;
    amount: number;
    note: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
