import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryDto } from '@/utils/types/query.dto';
import { FilterTransactionDto, SortTransactionDto } from './dto/query-transaction.dto';
import { Transaction } from './transaction.domain';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() query: QueryDto<FilterTransactionDto, SortTransactionDto>) {
    const limit = query.limit;
    const page = query.page;
    return this.transactionsService.findAll({
      filterOptions: query.filters,
      sortOptions: query.sort,
      paginationOptions: {
        limit, page
      }
    });
  }

  @Get(':id')
  findOne(@Param('id') id: Transaction['id']) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Transaction['id'], @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Transaction['id']) {
    return this.transactionsService.remove(id);
  }
}
