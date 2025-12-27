import { ParentEntity } from "@/modules/parents/entities/parent.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { data } from "./parent-data";
import { RoleEnum } from "@/modules/roles/roles.enum";
import { StudentEntity } from "modules/students/entities/student.entity";

@Injectable()
export class ParentSeedService {
    constructor(
        @InjectRepository(ParentEntity) private parentRepository: Repository<ParentEntity>,
        @InjectRepository(StudentEntity) private studentRepository: Repository<StudentEntity>
    ) { }

    async run() {
        const parents = await this.parentRepository.find()
        if (parents.length > 0) return;

        for (const item of data) {
            const students = await this.studentRepository.find({ where: { email: In(item.students) } })
            const dateParts = item.dayOfBirth.split('/');
            const birthDate = new Date(
                parseInt(dateParts[2]), // year
                parseInt(dateParts[0]) - 1, // month (0-indexed)
                parseInt(dateParts[1]) // day
            );
            await this.parentRepository.save(
                this.parentRepository.create({
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    dayOfBirth: birthDate,
                    gender: item.gender,
                    phone: item.phone,
                    address: item.address,
                    isEmailVerified: false,
                    role: RoleEnum[item.role],
                    students
                })
            )
        }
    }
}