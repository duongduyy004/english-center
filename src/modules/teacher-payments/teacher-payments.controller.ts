import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TeacherPaymentsService } from './teacher-payments.service';
import { QueryDto } from 'utils/types/query.dto';
import {
  FilterTeacherPaymentDto,
  SortTeacherPaymentDto,
} from './dto/query-teacher-payment.dto';

import { CreateTeacherPaymentDto } from './dto/create-teacher-payment.dto';
import { UpdateTeacherPaymentDto } from './dto/update-teacher-payment.dto';

@Controller('teacher-payments')
export class TeacherPaymentsController {
  constructor(
    private readonly teacherPaymentsService: TeacherPaymentsService,
  ) {}

  @Get('all')
  getAllPayments(
    @Query() query: QueryDto<FilterTeacherPaymentDto, SortTeacherPaymentDto>,
  ) {
    const limit = query.limit;
    const page = query.page;
    return this.teacherPaymentsService.getAllPayments({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        limit,
        page,
      },
    });
  }

  @Post()
  createPayment(@Body() createPaymentDto: CreateTeacherPaymentDto) {
    return this.teacherPaymentsService.createPayment(createPaymentDto);
  }

  @Patch(':id')
  updatePayment(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeacherPaymentDto,
  ) {
    return this.teacherPaymentsService.updatePayment(id, updateDto);
  }

  @Delete(':id')
  deletePayment(@Param('id') id: string) {
    return this.teacherPaymentsService.deletePayment(id);
  }
}
