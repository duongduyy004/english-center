import { IsOptional, IsString, IsIn } from 'class-validator';

export class FilterFeedbackDto {
    @IsOptional()
    @IsString()
    name?: string;
}

export class SortFeedbackDto {
    @IsIn(['name', 'description', 'createdAt', 'updatedAt'])
    orderBy: keyof FilterFeedbackDto | 'createdAt' | 'updatedAt';

    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}
