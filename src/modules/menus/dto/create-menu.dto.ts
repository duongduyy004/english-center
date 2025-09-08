import { IsString, IsNumber, IsUUID, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsUUID()
    parentId?: string;
}
