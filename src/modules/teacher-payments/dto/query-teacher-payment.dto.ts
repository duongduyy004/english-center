import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Class } from 'modules/classes/class.domain';
import { Payment } from 'modules/payments/payment.domain';
import { Teacher } from 'modules/teachers/teacher.domain';

export class FilterTeacherPaymentDto {
  @IsOptional()
  teacherId: Teacher['id'];

  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @Min(2020)
  year: number;

  @IsString()
  status: string;

  @IsNumber()
  @Min(1)
  @Max(12)
  startMonth: number;

  @IsNumber()
  @Min(1)
  @Max(12)
  endMonth: number;
}

export class SortTeacherPaymentDto {
  @IsString()
  orderBy: keyof Payment;
  @IsEnum(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}
