import { plainToInstance, Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { User } from "@/users/user.domain";

export class FilterUserDto {
    @IsString()
    name: string;
}

export class SortUserDto {
    @Type(() => String)
    @IsString()
    orderBy: keyof User;

    @IsString()
    order: string;
}

export class QueryUserDto {
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;

    @Transform(({ value }) => (value ? Number(value) : 10))
    @IsNumber()
    @IsOptional()
    limit?: number;

    @IsOptional()
    @Transform(({ value }) =>
        value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
    )
    @ValidateNested()
    @Type(() => FilterUserDto)
    filters?: FilterUserDto | null;

    @IsOptional()
    @Transform(({ value }) => {
        return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
    })
    @ValidateNested({ each: true })
    @Type(() => SortUserDto)
    sort?: SortUserDto[] | null;
}