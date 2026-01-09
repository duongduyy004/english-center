import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
    @IsOptional()
    @IsEnum(['active', 'upcoming', 'closed'])
    status?: 'active' | 'upcoming' | 'closed' | string;
}
