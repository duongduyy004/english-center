import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { FooterSettingsService } from './footer-settings.service';
import { CreateFooterSettingsDto } from './dto/create-footer-settings.dto';
import { UpdateFooterSettingsDto } from './dto/update-footer-settings.dto';
import { Public } from '@/decorator/customize.decorator';

@Controller('footer-settings')
export class FooterSettingsController {
    constructor(private readonly footerSettingsService: FooterSettingsService) { }

    @Get()
    @Public()
    findOne() {
        return this.footerSettingsService.findOne();
    }

    @Post()
    create(@Body() createFooterSettingsDto: CreateFooterSettingsDto) {
        return this.footerSettingsService.create(createFooterSettingsDto);
    }

    @Patch()
    update(@Body() updateFooterSettingsDto: UpdateFooterSettingsDto) {
        return this.footerSettingsService.update(updateFooterSettingsDto);
    }
}

