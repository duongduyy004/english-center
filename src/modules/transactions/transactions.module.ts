import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionCategoryEntity } from './entities/transaction-category.entity';
import { TransactionsCategoryController } from './transactions-category.controller';
import { TransactionsCategoryService } from './transactions-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, TransactionCategoryEntity])],
  controllers: [TransactionsController, TransactionsCategoryController],
  providers: [TransactionsService, TransactionRepository, TransactionsCategoryService]
})
export class TransactionsModule { }
