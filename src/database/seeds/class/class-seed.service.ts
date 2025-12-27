import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { data } from "./class-data";
import { StudentEntity } from "modules/students/entities/student.entity";
import { TeacherEntity } from "modules/teachers/entities/teacher.entity";

@Injectable()
export class ClassSeedService {
    constructor(
        @InjectRepository(ClassEntity) private classRepository: Repository<ClassEntity>,
        @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>,
        @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>
    ) { }

    async run() {
        function getRandomIntInclusive(min: number, max: number) {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
        }

        const classes = await this.classRepository.find()
        if (classes.length > 0) return;
        for (const item of data) {
            const students = await this.studentRepository.find({ where: { email: In(item.students) } });
            const teacher = await this.teacherRepository.findOne({ where: { email: item.teacher } })
            await this.classRepository.save(
                this.classRepository.create({
                    name: item.name,
                    grade: parseInt(item.grade),
                    section: parseInt(item.section),
                    year: item.year,
                    status: item.status,
                    schedule: {
                        days_of_week: item.schedule.dayOfWeeks.map(day => day.toString()),
                        start_date: new Date(item.schedule.startDate),
                        end_date: new Date(item.schedule.endDate),
                        time_slots: {
                            start_time: item.schedule.time_slots.start_time,
                            end_time: item.schedule.time_slots.start_time
                        }
                    },
                    feePerLesson: item.feePerLesson,
                    max_student: item.maxStudents,
                    description: item.description,
                    room: item.room,
                    students: students.map(item => ({
                        studentId: item.id,
                        discountPercent: getRandomIntInclusive(0, 15)
                    })),
                    teacher
                }), { listeners: false }
            )
        }
    }
}