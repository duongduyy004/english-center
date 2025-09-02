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
import { SessionEntity } from 'modules/sessions/entities/session.entity';
import { ResponseMessage } from '@/decorator/customize.decorator';

@Controller('teacher-payments')
export class TeacherPaymentsController {
  constructor(
    private readonly teacherPaymentsService: TeacherPaymentsService,
  ) { }

  @Get()
  @ResponseMessage('teacherPayment.SUCCESS.GET_ALL_TEACHER_PAYMENTS')
  getAllPayments(
    @Query() query: QueryDto<FilterTeacherPaymentDto, SortTeacherPaymentDto>,
  ) {
    return this.teacherPaymentsService.getAllPayments({
      filterOptions: query.filters || ({} as FilterTeacherPaymentDto),
      sortOptions: query.sort || [],
      paginationOptions: {
        limit: query.limit || 10,
        page: query.page || 1,
      },
    });
  }

  @Post()
  @ResponseMessage('teacherPayment.SUCCESS.MANUAL_TEACHER_PAYMENT')
  createPayment(@Body() createPaymentDto: CreateTeacherPaymentDto) {
    return this.teacherPaymentsService.createPayment(createPaymentDto);
  }

  @Get('report')
  exportReport(@Query() query: QueryDto<FilterTeacherPaymentDto, SortTeacherPaymentDto>) {
    const limit = query?.limit;
    const page = query?.page;
    return this.teacherPaymentsService.getAllPayments({
      filterOptions: query.filters,
      sortOptions: query.sort || [],
      paginationOptions: {
        limit, page
      }
    })
  }

  @Patch(':id')
  @ResponseMessage('teacherPayment.SUCCESS.UPDATE_TEACHER_PAYMENT')
  updatePayment(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeacherPaymentDto,
  ) {
    return this.teacherPaymentsService.updatePayment(id, updateDto);
  }

  @Delete(':id')
  @ResponseMessage('teacherPayment.SUCCESS.DELETE_TEACHER_PAYMENT')
  deletePayment(@Param('id') id: string) {
    return this.teacherPaymentsService.deletePayment(id);
  }

  // testing route only
  @Post('auto-update')
  @ResponseMessage('teacherPayment.SUCCESS.AUTO_TEACHER_PAYMENT')
  autoUpdatePayment(@Body() session: SessionEntity) {
    return this.teacherPaymentsService.autoUpdatePayment(session);
  }

  @Get(':id')
  @ResponseMessage('teacherPayment.SUCCESS.GET_TEACHER_PAYMENT_BY_ID')
  getPaymentById(@Param('id') id: string) {
    return this.teacherPaymentsService.getPaymentById(id);
  }
}
