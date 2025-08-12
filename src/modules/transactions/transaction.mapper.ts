import { TransactionEntity } from "./entities/transaction.entity";
import { Transaction } from "./transaction.domain";

export class TransactionMapper {
    static toDomain(raw: TransactionEntity): Transaction {
        const domainEntity = new Transaction();
        domainEntity.id = raw.id;
        domainEntity.amount = raw.amount;
        domainEntity.description = raw.description;
        domainEntity.type = raw.type;
        domainEntity.transaction_at = raw.transaction_at;
        return domainEntity;
    }
}