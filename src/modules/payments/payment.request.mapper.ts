import { PaymentRequestEntity } from "./entities/payment.request.entity";
import { PaymentRequest } from "./payment.request.domain";
import { PaymentMapper } from "./payment.mapper";

export class PaymentRequestMapper {
    static toDomain(raw: PaymentRequestEntity): PaymentRequest {
        const domainEntity = new PaymentRequest();

        domainEntity.id = raw.id;
        domainEntity.amount = raw.amount;
        domainEntity.imageProof = raw.imageProof;
        domainEntity.status = raw.status;
        domainEntity.requestedAt = raw.requestedAt;
        domainEntity.processedAt = raw.processedAt;
        domainEntity.processedBy = raw.processedBy;
        domainEntity.rejectionReason = raw.rejectionReason;
        
        if (raw.payment) {
            domainEntity.payment = PaymentMapper.toDomain(raw.payment);
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: PaymentRequest): PaymentRequestEntity {
        const entity = new PaymentRequestEntity();

        if (domainEntity.id) {
            entity.id = domainEntity.id;
        }
        
        entity.amount = domainEntity.amount;
        entity.imageProof = domainEntity.imageProof;
        entity.status = domainEntity.status as any;
        entity.requestedAt = domainEntity.requestedAt;
        entity.processedAt = domainEntity.processedAt;
        entity.processedBy = domainEntity.processedBy;
        entity.rejectionReason = domainEntity.rejectionReason;

        return entity;
    }
}