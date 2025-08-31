import { PartialType } from '@nestjs/mapped-types';
import { CreateIntroductionDto } from './create-introduction.dto';

export class UpdateIntroductionDto extends PartialType(CreateIntroductionDto) {}
