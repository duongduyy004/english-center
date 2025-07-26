import { Transform, Type } from "class-transformer";
import { Class } from "../class.domain";
import { IsNumber, IsOptional, ValidateNested, IsString, IsEnum, IsInt, Min, Max } from "class-validator";

export class FilterClassDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(12)
    grade?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    section?: number;

    @IsOptional()
    @IsInt()
    @Min(2020)
    year?: number;

    @IsOptional()
    @IsEnum(['active', 'upcoming', 'closed'])
    status?: 'active' | 'upcoming' | 'closed';

    @IsOptional()
    @IsString()
    room?: string;
}

export class SortClassDto {
    @IsString()
    orderBy: keyof Class;

    @IsEnum(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}


