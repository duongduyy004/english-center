import { IsOptional, IsString, IsIn } from 'class-validator';

export class FilterIntroductionDto {
    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    value?: string;
}

export class SortIntroductionDto {
    @IsIn(['key', 'value', 'createdAt', 'updatedAt'])
    orderBy: keyof FilterIntroductionDto | 'createdAt' | 'updatedAt';

    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}
