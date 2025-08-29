import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherPaymentDto } from './create-teacher-payment.dto';

export class UpdateTeacherPaymentDto extends PartialType(
  CreateTeacherPaymentDto,
) {}
