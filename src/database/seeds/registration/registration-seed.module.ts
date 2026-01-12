import { RegistrationEntity } from "@/modules/registrations/entities/registration.entity";
import { ClassEntity } from "@/modules/classes/entities/class.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RegistrationSeedService } from "./registration-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([RegistrationEntity, ClassEntity])],
    providers: [RegistrationSeedService],
    exports: [RegistrationSeedService]
})

export class RegistrationSeedModule { }
