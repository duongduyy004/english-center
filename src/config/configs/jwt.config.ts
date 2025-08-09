import { registerAs } from '@nestjs/config';
import {
    IsString,
    IsOptional
} from 'class-validator';
import validateConfig from 'utils/validate-config';
import { JwtConfig } from '@/config/types/jwt-config.type';

class EnvironmentVariablesValidator {

    @IsOptional()
    @IsString()
    JWT_ACCESS_SECRET: string;

    @IsOptional()
    @IsString()
    JWT_ACCESS_EXPIRATION_MINUTES: string;

    @IsOptional()
    @IsString()
    JWT_REFRESH_SECRET: string;

    @IsOptional()
    @IsString()
    JWT_REFRESH_EXPIRATION_DAYS: string;

    @IsOptional()
    @IsString()
    JWT_FORGOT_SECRET: string;

    @IsOptional()
    @IsString()
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: string;

    @IsOptional()
    @IsString()
    JWT_CONFIRM_EMAIL_SECRET: string;

    @IsOptional()
    @IsString()
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: string;
}

export default registerAs<JwtConfig>('jwt', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_access_expiration_minutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_refresh_expiration_days: process.env.JWT_REFRESH_EXPIRATION_DAYS,
        jwt_forgot_secret: process.env.JWT_FORGOT_SECRET,
        jwt_reset_password_expiration_minutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        jwt_confirm_email_secret: process.env.JWT_CONFIRM_EMAIL_SECRET,
        jwt_verify_email_expiration_minutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
    }
});

