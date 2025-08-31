export class TeacherPayment {
  id: string;
  month: number;
  year: number;
  totalAmount: number;
  paidAmount: number;
  status: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    phone: string;
    salaryPerLesson: number;
  };
  classes: {
    totalLessons: number;
    id: string;
    name: string;
    grade: number;
    section: number;
    year: number;
  }[];
  histories: {
    method: string;
    amount: number;
    note: string;
    date: Date;
  }[];
}
