import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Advertisement } from '../advertisement.domain';

export class FilterAdvertisementDto {
    @IsOptional()
    @IsEnum(['popup', 'banner'])
    type?: 'popup' | 'banner';

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    classId?: string;

    @IsOptional()
    @IsString()
    search?: string;
}

export class SortAdvertisementDto {
    @IsString()
    orderBy: keyof Advertisement;

    @IsEnum(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}
