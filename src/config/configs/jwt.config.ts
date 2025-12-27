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
}

export default registerAs<JwtConfig>('jwt', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_access_expiration_minutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_refresh_expiration_days: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    }
});

