import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Class } from 'modules/classes/class.domain';
import { Teacher } from 'modules/teachers/teacher.domain';
import { TeacherPayment } from '../teacher-payments.domain';

export class FilterTeacherPaymentDto {
  @IsOptional()
  @IsString()
  teacherId?: Teacher['id'];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Min(2020)
  year?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  startMonth?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  endMonth?: number;
}

export class SortTeacherPaymentDto {
  @IsString()
  orderBy: keyof TeacherPayment;
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
