import { IsString, IsEnum, IsOptional, IsInt, IsUUID, IsBoolean, IsUrl, MinLength, MaxLength, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdvertisementDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    title: string;

    @IsString()
    @MinLength(1)
    @MaxLength(1000)
    description: string;

    @IsEnum(['popup', 'banner'])
    type: 'popup' | 'banner';

    @IsInt()
    @Min(0)
    @Max(999)
    @Type(() => Number)
    priority: number;

    @IsUrl()
    imageUrl: string;

    @IsString()
    publicId: string;

    @IsOptional()
    @IsUUID()
    classId?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;
}
