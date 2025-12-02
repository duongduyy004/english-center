import { IsString, MinLength, MaxLength, Matches, IsNotEmpty, IsEmail } from 'class-validator';
import { PASSWORD_REGEX } from '@/utils/constants';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_REGEX)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
