import { TeacherEntity } from "@/modules/teachers/entities/teacher.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeacherSeedService } from "./teacher-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([TeacherEntity])],
    providers: [TeacherSeedService],
    exports: [TeacherSeedService]
})

export class TeacherSeedModule { }