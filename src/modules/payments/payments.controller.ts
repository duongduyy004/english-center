import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { QueryDto } from 'utils/types/query.dto';
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { Payment } from './payment.domain';
import { PayStudentDto } from './dto/pay-student.dto';
import { Public, UserInfo } from '@/decorator/customize.decorator';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { User } from '../users/user.domain';
import { ProcessRequestPaymentDto } from './dto/process-request-payment.dto';
import { ConfirmDto } from './dto/confirm.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get('all')
  getAllPayments(@Query() query: QueryDto<FilterPaymentDto, SortPaymentDto>) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    return this.paymentsService.getAllPayments({
      filterOptions: query.filters,
      sortOptions: query.sort || [],
      paginationOptions: {
        limit, page
      }
    })
  }

  @Get('students/:studentId')
  getPaymentBytStudentId(@Param('studentId') studentId: string, @Query() query: QueryDto<FilterPaymentDto, SortPaymentDto>, @UserInfo() user: any) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    return this.paymentsService.getAllPayments({
      filterOptions: { ...query.filters, studentId },
      sortOptions: query.sort || [],
      paginationOptions: {
        limit, page
      }
    })
  }

  @Get('report')
  exportReport(@Query() query: QueryDto<FilterPaymentDto, SortPaymentDto>) {
    const limit = query?.limit;
    const page = query?.page;
    return this.paymentsService.getAllPayments({
      filterOptions: query.filters,
      sortOptions: query.sort || [],
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

  @Patch('request/:paymentId')
  requestPayment(
    @Param('paymentId') paymentId: Payment['id'],
    @Body() requestPaymentDto: RequestPaymentDto,
  ) {
    return this.paymentsService.requestPayment(paymentId, requestPaymentDto);
  }

  @Patch('process/:paymentRequestId')
  processRequestPayment(
    @Param('paymentRequestId') paymentRequestId: number,
    @Body() processRequestPaymentDto: ProcessRequestPaymentDto,
    @UserInfo() user: User
  ) {
    return this.paymentsService.processRequestPayment(paymentRequestId, processRequestPaymentDto, user);
  }

  @Public()
  @Post('confirm-payments')
  confirmPayment(@Body() confirmDto: ConfirmDto) {
    console.log(confirmDto)
    return { success: true, confirmDto };
  }
}
