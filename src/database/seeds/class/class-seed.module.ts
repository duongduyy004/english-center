import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassSeedService } from "./class-seed.service";
import { StudentEntity } from "modules/students/entities/student.entity";
import { TeacherEntity } from "modules/teachers/entities/teacher.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ClassEntity, StudentEntity, TeacherEntity])],
    providers: [ClassSeedService],
    exports: [ClassSeedService]
})

export class ClassSeedModule { }