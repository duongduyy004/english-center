import { Class } from 'modules/classes/class.domain';
import { Histories } from 'modules/payments/entities/payment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClassEntity } from 'modules/classes/entities/class.entity';
import { TeacherEntity } from 'modules/teachers/entities/teacher.entity';
import { Teacher } from 'modules/teachers/teacher.domain';

export class ClassLessons {
  @Column()
  classId: Class['id'];

  @OneToOne(() => ClassEntity)
  @JoinColumn({ name: 'classId' })
  class: Partial<Class>;

  @Column()
  totalLessons: number;
}

@Entity('teacher_payments')
export class TeacherPaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ default: 0 })
  totalAmount: number;

  @Column({ default: 0 })
  paidAmount: number;

  @Column({ enum: ['pending', 'partial', 'paid'], default: 'pending' })
  status: string;

  @Column()
  teacherId: Teacher['id'];

  @Column('jsonb', { nullable: true, default: [] })
  classes: ClassLessons[];

  @Column('jsonb', { nullable: true, default: [] })
  histories: Histories[];

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.payments)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;
}
