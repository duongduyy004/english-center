import { ParentEntity } from "@/modules/parents/entities/parent.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParentSeedService } from "./parent-seed.service";
import { StudentEntity } from "modules/students/entities/student.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ParentEntity, StudentEntity])],
    providers: [ParentSeedService],
    exports: [ParentSeedService]
})

export class ParentSeedModule { }