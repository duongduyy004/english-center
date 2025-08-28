import { TeacherEntity } from "@/modules/teachers/entities/teacher.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { data } from "./teacher-data";
import { RoleEnum } from "@/modules/roles/roles.enum";
import { isString } from "class-validator";

@Injectable()
export class TeacherSeedService {
    constructor(
        @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>
    ) { }

    async run() {
        const teachers = await this.teacherRepository.find();
        if (teachers.length > 0) return;

        for (const item of data) {
            const dateParts = item.dayOfBirth.split('/');
            const birthDate = new Date(
                parseInt(dateParts[2]), // year
                parseInt(dateParts[0]) - 1, // month (0-indexed)
                parseInt(dateParts[1]) // day
            );
            await this.teacherRepository.save(
                this.teacherRepository.create({
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    dayOfBirth: birthDate,
                    gender: item.gender,
                    phone: item.phone,
                    address: item.address,
                    isEmailVerified: false,
                    role: RoleEnum[item.role],
                    isActive: item.isActive,
                    salaryPerLesson: item.salaryPerLesson,
                    qualifications: item.qualifications,
                    specializations: item.specialization,
                    description: item.description
                }),
                { listeners: false }
            )
        }
    }
}