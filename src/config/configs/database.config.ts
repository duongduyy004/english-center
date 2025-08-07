import { registerAs } from '@nestjs/config';
import {
    IsInt,
    Min,
    Max,
    IsString,
    IsOptional,
    ValidateIf
} from 'class-validator';
import validateConfig from 'utils/validate-config';
import { DatabaseConfig } from '@/config/types/database-config.type';

class EnvironmentVariablesValidator {

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(65535)
    DATABASE_PORT: number;

    @IsOptional()
    @IsString()
    DATABASE_PASSWORD: string;

    @IsOptional()
    @IsString()
    DATABASE_NAME: string;

    @IsOptional()
    @IsString()
    DATABASE_USERNAME: string;

    @IsOptional()
    @IsString()
    DATABASE_TYPE: string;

    @IsOptional()
    @IsString()
    DATABASE_HOST: string;
}

export default registerAs<DatabaseConfig>('database', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        port: process.env.DATABASE_PORT
            ? parseInt(process.env.DATABASE_PORT, 10)
            : 5432,
        password: process.env.DATABASE_PASSWORD,
        dbName: process.env.DATABASE_NAME,
        username: process.env.DATABASE_USERNAME || '',
        type: process.env.DATABASE_TYPE || '',
        host: process.env.DATABASE_HOST
    };
});
