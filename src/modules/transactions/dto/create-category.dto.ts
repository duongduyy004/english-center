import { I18nTranslations } from "@/generated/i18n.generated";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export enum TransactionType {
    REVENUE = 'revenue',
    EXPENSE = 'expense'
}

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsEnum(TransactionType, {
        message: i18nValidationMessage<I18nTranslations>('validation.INVALID_ENUM_VALUE', {
            values: Object.values(TransactionType).join(', ')
        })
    })
    type: string;

    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    name: string;
}