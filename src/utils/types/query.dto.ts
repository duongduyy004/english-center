import { plainToInstance, Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, ValidateNested } from "class-validator";

export class QueryDto<Filter, Sort> {
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
        value ? JSON.parse(value) : undefined,
    )
    @ValidateNested()
    @Type(() => Object)
    filters?: Filter | null;

    @IsOptional()
    @Transform(({ value }) => {
        return value ? JSON.parse(value) : undefined;
    })
    @ValidateNested({ each: true })
    @Type(() => Object)
    sort?: Sort[] | null;
}