import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { QueryDto } from 'utils/types/query.dto';
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { Payment } from './payment.domain';
import { PayStudentDto } from './dto/pay-student.dto';
import { User } from '@/decorator/customize.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get('all')
  getAllPayments(@Query() query: QueryDto<FilterPaymentDto, SortPaymentDto>) {
    const limit = query.limit;
    const page = query.page;
    return this.paymentsService.getAllPayments({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        limit, page
      }
    })
  }

  @Get('students/:studentId')
  getPaymentBytStudentId(@Param('studentId') studentId: string, @Query() query: QueryDto<FilterPaymentDto, SortPaymentDto>, @User() user: any) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    return this.paymentsService.getAllPayments({
      filterOptions: { ...query.filters, studentId },
      sortOptions: query.sort,
      paginationOptions: {
        limit, page
      }
    })
  }

  @Patch('pay-student/:paymentId')
  payStudent(
    @Param('paymentId') paymentId: Payment['id'],
    @Body() payStudentDto: PayStudentDto
  ) {
    return this.paymentsService.payStudent(paymentId, payStudentDto)
  }
}
