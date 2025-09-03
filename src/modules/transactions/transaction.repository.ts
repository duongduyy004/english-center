import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "./entities/transaction.entity";
import { Between, FindOptionsWhere, In, Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { TransactionMapper } from "./transaction.mapper";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { FilterTransactionDto, SortTransactionDto } from "./dto/query-transaction.dto";
import { PaginationResponseDto } from "@/utils/types/pagination-response.dto";
import { Transaction } from "./transaction.domain";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { TransactionCategoryEntity } from "./entities/transaction-category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";

export class TransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity) private transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(TransactionCategoryEntity) private transactionCategoryRepository: Repository<TransactionCategoryEntity>
    ) { }

    async create(createTransactionDto: CreateTransactionDto) {
        const category = await this.transactionCategoryRepository.findOne({
            where: { id: createTransactionDto.categoryId }
        })
        const entity = await this.transactionRepository.save(
            this.transactionRepository.create({
                amount: createTransactionDto.amount,
                description: createTransactionDto.description,
                category: category
            })
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
        if (filterOptions?.type) {
            const category = await this.transactionCategoryRepository.findOne({
                where: { type: filterOptions.type }
            })

            where.category = category
        }
        if (filterOptions?.startDate && filterOptions?.endDate) {
            where.transactionAt = Between(filterOptions.startDate, filterOptions.endDate)
        }
        const [entities, total] = await this.transactionRepository.findAndCount({
            where,
            skip: (paginationOptions.page - 1) * paginationOptions.limit || 0,
            take: paginationOptions.limit,
            relations: ['category'],
            order: sortOptions?.reduce(
                (accumulator, sort) => ({
                    ...accumulator,
                    [sort.orderBy]: sort.order,
                }),
                {},
            ),
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit) || 1;

        return {
            meta: {
                page: paginationOptions.page || null,
                limit: paginationOptions.limit || null,
                totalPages,
                totalItems
            },
            result: entities ? entities.map((item) => TransactionMapper.toDomain(item)) : null
        }
    }

    async findById(id: Transaction['id']) {
        const entity = await this.transactionRepository.findOne({
            where: { id },
            relations: ['category']
        })

        return entity ? TransactionMapper.toDomain(entity) : null
    }

    async update(id: Transaction['id'], updateTransactionDto: UpdateTransactionDto) {
        const entity = await this.transactionRepository.findOne({ where: { id }, relations: ['category'] })
        if (updateTransactionDto?.amount) entity.amount = updateTransactionDto.amount;
        if (updateTransactionDto?.description) entity.description = updateTransactionDto.description;
        if (updateTransactionDto?.categoryId) {
            const category = await this.transactionCategoryRepository.findOne({ where: { id: updateTransactionDto.categoryId } })
            entity.category = category;
        }
        await this.transactionRepository.save(entity);

        return TransactionMapper.toDomain(entity)
    }

    async delete(id: Transaction['id']) {
        return this.transactionRepository.softRemove({ id });
    }

}