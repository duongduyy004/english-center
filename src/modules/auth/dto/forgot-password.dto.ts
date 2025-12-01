import { IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { PASSWORD_REGEX } from '@/utils/constants';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
