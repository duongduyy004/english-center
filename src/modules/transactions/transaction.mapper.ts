import { TransactionEntity } from "./entities/transaction.entity";
import { Transaction } from "./transaction.domain";

export class TransactionMapper {
    static toDomain(raw: TransactionEntity): Transaction {
        const domainEntity = new Transaction();
        domainEntity.id = raw.id;
        domainEntity.amount = raw.amount;
        domainEntity.description = raw.description;
        domainEntity.category = {
            id: raw.category.id,
            name: raw.category.name,
            type: raw.category.type
        };
        domainEntity.transactionAt = raw.transactionAt;

        return domainEntity;
    }

    static toPersistence(domainEntity: Transaction): TransactionEntity {
        const persistenceEntity = new TransactionEntity();
        persistenceEntity.id = domainEntity.id;
        persistenceEntity.amount = domainEntity.amount;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.category = domainEntity.category
        persistenceEntity.transactionAt = domainEntity.transactionAt;
        return persistenceEntity;
    }
}