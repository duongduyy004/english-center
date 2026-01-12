import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@/generated/i18n.generated';

export class PayStudentDto {
    @IsNumber()
    @Min(1, { message: i18nValidationMessage<I18nTranslations>('validation.MIN_VALUE') })
    amount: number;

    @IsString()
    method: string;

    @IsString()
    @IsOptional()
    note: string;
}