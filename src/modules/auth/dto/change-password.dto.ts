import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { PASSWORD_REGEX } from '@/utils/constants';

export class ChangePasswordDto {
    @IsString()
    @Matches(PASSWORD_REGEX)
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @Matches(PASSWORD_REGEX)
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    confirmPassword: string;
}
