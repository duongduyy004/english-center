import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterSettingsService } from './footer-settings.service';
import { FooterSettingsController } from './footer-settings.controller';
import { FooterSettingsEntity } from './entities/footer-settings.entity';
import { FooterSettingsRepository } from './footer-settings.repository';
import { FooterSettingsMapper } from './footer-settings.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([FooterSettingsEntity])],
    controllers: [FooterSettingsController],
    providers: [FooterSettingsService, FooterSettingsRepository, FooterSettingsMapper],
    exports: [FooterSettingsService, FooterSettingsRepository]
})
export class FooterSettingsModule { }

