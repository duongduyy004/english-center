import { StudentEntity } from "@/modules/students/entities/student.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { data } from "./student-data";
import { RoleEnum } from "@/modules/roles/roles.enum";

@Injectable()
export class StudentSeedService {
    constructor(
        @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>
    ) { }

    async run() {
        const students = await this.studentRepository.find()
        if (students.length > 0) return;

        for (const item of data) {
            const dateParts = item.dayOfBirth.split('/');
            const birthDate = new Date(
                parseInt(dateParts[2]), // year
                parseInt(dateParts[0]) - 1, // month (0-indexed)
                parseInt(dateParts[1]) // day
            );
            await this.studentRepository.save(
                this.studentRepository.create({
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    dayOfBirth: birthDate,
                    gender: item.gender,
                    phone: item.phone,
                    address: item.address,
                    isEmailVerified: false,
                    role: RoleEnum[item.role]
                })
            )
        }
    }
}
