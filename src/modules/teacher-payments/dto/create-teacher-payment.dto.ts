import { Class } from '@/modules/classes/class.domain';
import { Teacher } from '@/modules/teachers/teacher.domain';
import { ClassLessons } from '../entities/teacher-payment.entity';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class HistoryDto {
  @IsString()
  method: string;

  @IsNumber()
  amount: number;

  @IsString()
  note: string;

  @IsOptional()
  @IsDate()
  date: Date;
}

export class ClassLessonsDto {
  @IsUUID()
  classId: Class['id'];

  @IsNumber()
  totalLessons: number;
}

export class CreateTeacherPaymentDto {
  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  paidAmount: number;

  @IsString()
  status: string;

  @IsUUID()
  teacherId: Teacher['id'];

  @IsOptional()
  classes: ClassLessonsDto[];

  @IsOptional()
  histories: HistoryDto[];
}
