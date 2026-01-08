import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
    @IsNotEmpty()
    @IsEnum(['active', 'upcoming', 'closed'])
    status?: 'active' | 'upcoming' | 'closed' | string;
}
