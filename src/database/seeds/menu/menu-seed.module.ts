import { MenuEntity } from "@/modules/menus/entities/menu.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuSeedService } from "./menu-seed.service";

@Module({
    imports: [TypeOrmModule.forFeature([MenuEntity])],
    providers: [MenuSeedService],
    exports: [MenuSeedService]
})

export class MenuSeedModule { }