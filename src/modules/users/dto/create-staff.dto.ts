import { I18nTranslations } from '@/generated/i18n.generated';
import { PASSWORD_REGEX } from 'utils/constants';
import { Transform } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Role } from '@/modules/roles/role.domain';

export class CreateStaffDto {
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    @IsString()
    name: string;

    @IsEmail(
        {},
        {
            message: i18nValidationMessage<I18nTranslations>(
                'validation.INVALID_EMAIL',
            ),
        },
    )
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    email: string;

    @IsString()
    @Matches(PASSWORD_REGEX, {
        message: i18nValidationMessage<I18nTranslations>('validation.PASSWORD'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    password: string;

    @IsString()
    @IsEnum(['male', 'female'])
    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    gender: string;

    @IsDate()
    @Transform(({ value }) => {
        if (!value) return undefined;

        // Handle MM/DD/YYYY format
        const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = value.match(dateRegex);

        if (match) {
            const [, month, day, year] = match;
            // Create UTC date to avoid timezone issues
            const date = new Date(
                Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)),
            );

            // Validate the date is actually valid in UTC
            if (
                date.getUTCFullYear() == year &&
                date.getUTCMonth() == month - 1 &&
                date.getUTCDate() == day
            ) {
                return date;
            }
        }

        // Fallback: try to parse as standard date
        const fallbackDate = new Date(value);
        if (isNaN(fallbackDate.getTime())) {
            throw new Error(
                'Invalid date format. Expected MM/DD/YYYY or valid date string',
            );
        }

        return fallbackDate;
    })
    dayOfBirth: Date;

    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    @IsString()
    address: string;

    @IsNotEmpty({
        message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
    })
    @IsString()
    phone: string;

    @IsOptional()
    roleId: Role['id'];
}