import { I18nTranslations } from "@/generated/i18n.generated";
import { IsNotEmpty, IsString, IsIn } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreatePermissionDto {
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString()
    path: string;

    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString()
    @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    method: string;

    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString()
    description: string;

    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString()
    module: string;
}
