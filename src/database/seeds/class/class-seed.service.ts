import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { data } from "./class-data";

@Injectable()
export class ClassSeedService {
    constructor(
        @InjectRepository(ClassEntity) private classRepository: Repository<ClassEntity>
    ) { }

    async run() {

        const classes = await this.classRepository.find()
        if (classes.length > 0) return;
        for (const item of data) {
            await this.classRepository.save(
                this.classRepository.create({
                    name: item.name,
                    grade: parseInt(item.grade),
                    section: parseInt(item.section),
                    year: item.year,
                    status: item.status,
                    schedule: {
                        days_of_week: item.schedule.dayOfWeeks.map(day => day.toString()),
                        start_date: new Date(item.schedule.startDate.$date),
                        end_date: new Date(item.schedule.endDate.$date),
                        time_slots: {
                            start_time: item.schedule.timeSlots.startTime,
                            end_time: item.schedule.timeSlots.endTime
                        }
                    },
                    feePerLesson: item.feePerLesson,
                    max_student: item.maxStudents,
                    description: item.description,
                    room: item.room,
                }), { listeners: false }
            )
        }
    }
}