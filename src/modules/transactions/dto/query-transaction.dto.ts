import { Transaction } from "modules/transactions/transaction.domain";

export class FilterTransactionDto {
    type: string;
    startDate: Date;
    endDate: Date;
}

export class SortTransactionDto {
    orderBy: keyof Transaction;
    order: 'ASC' | 'DESC';
}