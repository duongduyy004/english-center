import { InjectRepository } from "@nestjs/typeorm";
import { TeacherPaymentEntity } from "./entities/teacher-payment.entity";
import { Between, FindOptionsWhere, Repository } from "typeorm";
import { FilterTeacherPaymentDto, SortTeacherPaymentDto } from "./dto/query-teacher-payment.dto";
import { IPaginationOptions } from "utils/types/pagination-options";
import { SessionEntity } from "modules/sessions/entities/session.entity";
import { SessionsService } from "modules/sessions/sessions.service";
import * as dayjs from 'dayjs'

export class TeacherPaymentRepository {
    constructor(
        @InjectRepository(TeacherPaymentEntity) private teacherPaymentRepository: Repository<TeacherPaymentEntity>,
        private sessionsService: SessionsService
    ) { }

    async autoUpdateTeacherPaymentRecord(session: SessionEntity) {
        const totalLessons = await this.sessionsService.getTotalSessions(session.classId);
        const month = dayjs(session.date).month() + 1;
        const year = dayjs(session.date).year();
        const entity = await this.teacherPaymentRepository.findOne({
            where: {
                teacherId: session?.class?.teacher?.id,
                month, year
            }
        })

        // if entity exsits, update teacher payment
        if (entity) {

        }
    }

    async getAllPayments({ filterOptions, sortOptions, paginationOptions }
        : { filterOptions: FilterTeacherPaymentDto, sortOptions: SortTeacherPaymentDto[], paginationOptions: IPaginationOptions }) {
        const where: FindOptionsWhere<TeacherPaymentEntity> = {};

        if (filterOptions?.teacherId) where.teacherId = filterOptions.teacherId

        if (filterOptions?.status) where.status = filterOptions.status

        if (filterOptions?.month) where.month = filterOptions.month

        if (filterOptions?.year) where.year = filterOptions.year

        if (filterOptions?.startMonth && filterOptions?.endMonth) {
            where.month = Between(filterOptions.startMonth, filterOptions.endMonth);
            where.year = filterOptions.year;
        }

        const [entities, total] = await this.teacherPaymentRepository.findAndCount({
            where: where,
            relations: ['teacher'],
            skip: (paginationOptions.page - 1) * paginationOptions.limit,
            take: paginationOptions.limit
        })

        const totalItems = total;
        const totalPages = Math.ceil(totalItems / paginationOptions.limit)

        return {
            meta: {
                limit: paginationOptions.limit,
                page: paginationOptions.page,
                totalPages,
                totalItems
            },
            result: entities
        }
    }
}