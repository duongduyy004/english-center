import { PartialType } from '@nestjs/mapped-types';
import { CreateFooterSettingsDto } from './create-footer-settings.dto';

export class UpdateFooterSettingsDto extends PartialType(CreateFooterSettingsDto) {}

