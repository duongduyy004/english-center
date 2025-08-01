import { PaymentEntity } from "./entities/payment.entity";
import { Payment } from "./payment.domain";

export class PaymentMapper {
    static toDomain(raw: PaymentEntity) {
        const domainEntity = new Payment()

        domainEntity.id = raw.id;
        domainEntity.month = raw.month;
        domainEntity.year = raw.year;
        domainEntity.totalLessons = raw.totalLessons;
        domainEntity.paidAmount = raw.paidAmount;
        domainEntity.student = {
            id: raw.student.id,
            name: raw.student.name,
            email: raw.student.email,
            phone: raw.student.phone
        }
        domainEntity.class = {
            id: raw.class.id,
            name: raw.class.name,

        }
        if (raw.histories) {
            domainEntity.histories = raw.histories.map(item => ({
                id: item.id,
                amount: item.amount,
                method: item.method,
                date: item.date,
                note: item.note
            }))
        }

        return domainEntity;
    }

    static toPersistence(domainEntity: Payment) {

    }
}