import { RegistrationEntity } from "@/modules/registrations/entities/registration.entity";
import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { data } from "./registration-data";

@Injectable()
export class RegistrationSeedService {
    constructor(
        @InjectRepository(RegistrationEntity)
        private registrationRepository: Repository<RegistrationEntity>,
        @InjectRepository(ClassEntity)
        private classRepository: Repository<ClassEntity>
    ) { }

    async run() {
        const registrations = await this.registrationRepository.find();
        if (registrations.length > 0) return;

        for (const item of data) {
            // Tìm class theo grade, section và year
            const classEntity = await this.classRepository.findOne({
                where: {
                    grade: item.class.grade,
                    section: item.class.section,
                    year: item.class.year
                }
            });

            if (!classEntity) {
                console.warn(`Class not found: grade ${item.class.grade}, section ${item.class.section}, year ${item.class.year}, skipping registration for ${item.name}`);
                continue;
            }

            await this.registrationRepository.save(
                this.registrationRepository.create({
                    email: item.email,
                    name: item.name,
                    phone: item.phone,
                    gender: item.gender,
                    address: item.address,
                    note: item.note,
                    processed: item.processed,
                    classId: classEntity.id,
                    class: classEntity
                })
            );
        }

        console.log('✅ Registration seed data created successfully');
    }
}
