import { I18nTranslations } from "@/generated/i18n.generated";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateTransactionDto {

    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsNumber()
    @Transform(({ value }) => {
        // Convert string to number if it's a valid number
        if (typeof value === 'string') {
            const parsed = Number(value);
            return isNaN(parsed) ? value : parsed;
        }
        return value;
    })
    amount: number;

    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    categoryId: number

    @IsString()
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    description: string;
}
