import { Transform, Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsEnum,
    IsOptional,
    ValidateNested,
    IsArray,
    IsDateString,
    Min,
    Max,
    IsInt
} from 'class-validator';

export class CreateTimeSlotsDto {
    @IsNotEmpty()
    @IsString()
    start_time: string;

    @IsNotEmpty()
    @IsString()
    end_time: string;
}

export class CreateScheduleDto {
    @IsNotEmpty()
    @IsDateString()
    start_date: Date;

    @IsNotEmpty()
    @IsDateString()
    end_date: Date;

    @IsArray()
    @IsEnum(['0', '1', '2', '3', '4', '5', '6'], { each: true })
    days_of_week: string[];

    @ValidateNested()
    @Type(() => CreateTimeSlotsDto)
    time_slots: CreateTimeSlotsDto;
}

export class CreateClassDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(12)
    grade: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    section: number;

    @IsNotEmpty()
    @IsInt()
    @Min(2020)
    year: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    feePerLesson: number;

    @IsNotEmpty()
    @IsEnum(['active', 'upcoming', 'closed'])
    status: 'active' | 'upcoming' | 'closed';

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(50)
    max_student: number;

    @IsNotEmpty()
    @IsString()
    room: string;

    @ValidateNested()
    @Type(() => CreateScheduleDto)
    schedule: CreateScheduleDto;
}
