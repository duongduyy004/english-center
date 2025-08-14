import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassSeedService } from "./class-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([ClassEntity])],
    providers: [ClassSeedService],
    exports: [ClassSeedService]
})

export class ClassSeedModule { }