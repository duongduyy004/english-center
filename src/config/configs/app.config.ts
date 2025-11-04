import { registerAs } from '@nestjs/config';
import { AppConfig } from '@/config/types/app-config.type';
import validateConfig from 'utils/validate-config';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
} from 'class-validator';

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

class EnvironmentVariablesValidator {
    @IsEnum(Environment)
    @IsOptional()
    NODE_ENV: Environment;

    @IsInt()
    @Min(0)
    @Max(65535)
    @IsOptional()
    APP_PORT: number;

    @IsUrl({ require_tld: false })
    @IsOptional()
    FRONTEND_DOMAIN: string;

    @IsUrl({ require_tld: false })
    @IsOptional()
    BACKEND_DOMAIN: string;

    @IsString()
    @IsOptional()
    APP_NAME: string;

    @IsString()
    TZ: string
}

export default registerAs<AppConfig>('app', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);
    return {
        nodeEnv: process.env.NODE_ENV || 'development',
        timeZone: process.env.TZ,
        name: process.env.APP_NAME || 'app',
        frontendDomain: process.env.FRONTEND_DOMAIN,
        backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
        port: process.env.APP_PORT
            ? parseInt(process.env.APP_PORT, 10)
            : process.env.PORT
                ? parseInt(process.env.PORT, 10)
                : 8080,
    };
});
