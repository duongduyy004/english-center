import { StudentEntity } from "@/modules/students/entities/student.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentSeedService } from "./student-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([StudentEntity])],
    providers: [StudentSeedService],
    exports: [StudentSeedService]
})

export class StudentSeedModule { }