import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { FilterTransactionDto, SortTransactionDto } from './dto/query-transaction.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { PaginationResponseDto } from '@/utils/types/pagination-response.dto';
import { Transaction } from './transaction.domain';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionRepository: TransactionRepository,
    private i18nService: I18nService<I18nTranslations>
  ) { }
  create(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.create(createTransactionDto);
  }

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTransactionDto | null;
    sortOptions?: SortTransactionDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<PaginationResponseDto<Transaction>> {
    return this.transactionRepository.getAllTransactions({ filterOptions, sortOptions, paginationOptions });
  }

  async findOne(id: Transaction['id']) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) throw new BadRequestException(this.i18nService.t('common.NOT_FOUND', {
      args: {
        entity: "transaction"
      }
    }))
    return transaction
  }

  update(id: Transaction['id'], updateTransactionDto: UpdateTransactionDto) {
    return this.transactionRepository.update(id, updateTransactionDto);
  }

  remove(id: Transaction['id']) {
    return this.transactionRepository.delete(id);
  }
}
