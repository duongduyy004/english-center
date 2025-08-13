import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "./entities/transaction.entity";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionMapper } from "./transaction.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { FilterTransactionDto, SortTransactionDto } from "./dto/query-transaction.dto";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";
import { Transaction } from "./transaction.domain";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

export class TransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity) private transactionRepository: Repository<TransactionEntity>
    ) { }

    async create(createTransactionDto: CreateTransactionDto) {
        const entity = await this.transactionRepository.save(
            this.transactionRepository.create(createTransactionDto)
        )

        return TransactionMapper.toDomain(entity);
    }

    async getAllTransactions({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterTransactionDto | null;
        sortOptions?: SortTransactionDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<PaginationResponseDto<Transaction>> {
        const where: FindOptionsWhere<TransactionEntity> = {};
        if (filterOptions?.type) where.type = filterOptions.type;
        if (filterOptions?.startDate && filterOptions?.endDate) {
            where.transaction_at = Between(filterOptions.startDate, filterOptions.endDate)
        }
        const [entities, total] = await this.transactionRepository.findAndCount({
            where,
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit,
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)

        return {
            meta: {
                page: paginationOptions.page,
                limit: paginationOptions.limit,
                totalPages,
                totalItems
            },
            result: entities.map((item) => TransactionMapper.toDomain(item))
        }
    }

    async findById(id: Transaction['id']) {
        const entity = await this.transactionRepository.findOne({
            where: { id }
        })

        return entity ? TransactionMapper.toDomain(entity) : null
    }

    async update(id: Transaction['id'], updateTransactionDto: UpdateTransactionDto) {
        const entity = await this.transactionRepository.findOne({ where: { id } })
        if (updateTransactionDto?.amount) entity.amount = updateTransactionDto.amount;
        if (updateTransactionDto?.description) entity.description = updateTransactionDto.description;
        if (updateTransactionDto?.type) entity.type = updateTransactionDto.type;

        await this.transactionRepository.save(entity);

        return TransactionMapper.toDomain(entity)
    }

    async delete(id: Transaction['id']) {
        return this.transactionRepository.softDelete({ id });
    }
}