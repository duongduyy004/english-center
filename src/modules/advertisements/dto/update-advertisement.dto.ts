import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvertisementDto } from './create-advertisement.dto';

export class UpdateAdvertisementDto extends PartialType(CreateAdvertisementDto) {}
