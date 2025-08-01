import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entities/payment.entity";
import { Repository } from "typeorm";
import { Session } from "@/modules/sessions/session.domain";
import * as dayjs from "dayjs";

@Injectable()
export class PaymentRepository {
    constructor(
        @InjectRepository(PaymentEntity) private paymentsRepository: Repository<PaymentEntity>
    ) { }

    async autoUpdatePaymentRecord(session: Session) {
        const month = dayjs(session.date).month() + 1;
        const year = dayjs(session.date).year();
        const classId = session.class.id
        const paymentEntities = await this.paymentsRepository.find({
            where: { month, year, classId },
            relations: ['class']
        })

        if (paymentEntities.length <= 0) {
            const paymentRecords = session.attendances.map(student => {
                let totalLessons = 0
                if (student.status === 'present' || student.status === 'late') totalLessons++;
                return this.paymentsRepository.create({
                    month,
                    year,
                    totalLessons,
                    studentId: parseInt(student.student.id.toString()),
                    classId: parseInt(classId.toString())
                })
            })
            return await this.paymentsRepository.save(paymentRecords)
        }
        else if (paymentEntities.length > 0) {
            for (const student of session.attendances) {
                paymentEntities.map(item => {
                    if (item.studentId === student.student.id && student.isModified === true) {
                        item.totalLessons =
                            student.status === 'present' || student.status === 'late' ? item.totalLessons + 1 : item.totalLessons;
                        item.totalLessons =
                            student.status === 'absent' && item.totalLessons > 0 ? item.totalLessons - 1 : item.totalLessons;
                    }
                })
            }
            this.paymentsRepository.save(paymentEntities)
        }
        return paymentEntities
    }
}