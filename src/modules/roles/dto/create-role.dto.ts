import { I18nTranslations } from "@/generated/i18n.generated";
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateRoleDto {
    @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY') })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
