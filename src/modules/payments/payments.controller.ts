import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { QueryDto } from 'utils/types/query.dto';
import { FilterPaymentDto, SortPaymentDto } from './dto/query-payment.dto';
import { Payment } from './payment.domain';
import { PayStudentDto } from './dto/pay-student.dto';
import { Public, UserInfo } from '@/decorator/customize.decorator';
import { GetQRDto } from './dto/get-QR.dto';
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

  @Get('qrcode')
  getQRCode(@Body() getQrDto: GetQRDto) {
    return this.paymentsService.getQR(getQrDto);
  }

  @Public()
  @Post('confirm-payment')
  confirmPayment(
    @Body() confirmDto: ConfirmDto,
    @Headers('Authorization') apiKey: string
  ) {
    return this.paymentsService.confirmPayment(confirmDto, apiKey)
  }
}
