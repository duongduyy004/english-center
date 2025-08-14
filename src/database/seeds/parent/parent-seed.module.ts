import { ParentEntity } from "@/modules/parents/entities/parent.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParentSeedService } from "./parent-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([ParentEntity])],
    providers: [ParentSeedService],
    exports: [ParentSeedService]
})

export class ParentSeedModule { }