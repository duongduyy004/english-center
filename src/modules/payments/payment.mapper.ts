import { PaymentEntity } from "./entities/payment.entity";
import { Payment } from "./payment.domain";

export class PaymentMapper {
    static toDomain(raw: PaymentEntity): Payment {
        const domainEntity = new Payment()

        domainEntity.id = raw.id;
        domainEntity.month = raw.month;
        domainEntity.year = raw.year;
        domainEntity.totalLessons = raw.totalLessons;
        domainEntity.paidAmount = raw.paidAmount;
        domainEntity.totalAmount = raw.totalAmount;
        domainEntity.discountAmount = raw.totalAmount * raw.discountPercent / 100;
        domainEntity.status = raw.status;
        if (raw.student) {
            domainEntity.student = {
                id: raw.student.id,
                name: raw.student.name,
                email: raw.student.email,
                phone: raw.student.phone,
            }
        }
        if (raw.class) {
            domainEntity.class = {
                id: raw.class.id,
                name: raw.class.name,
            }
        }
        if (raw.histories) {
            domainEntity.histories = raw.histories.map(item => ({
                amount: item.amount,
                method: item.method,
                date: item.date,
                note: item.note
            }))
        }

        if (raw.paymentRequests) {
            domainEntity.paymentRequests = raw.paymentRequests.map(item => ({
                id: item.id,
                amount: item.amount,
                imageProof: item.imageProof,
                status: item.status,
                requestedAt: item.requestedAt,
                processedAt: item.processedAt,
                processedBy: item.processedBy,
                rejectionReason: item.rejectionReason
            }))
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: Payment) {

    }
}