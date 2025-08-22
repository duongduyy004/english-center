import { registerAs } from '@nestjs/config';
import {
    IsInt,
    Min,
    Max,
    IsString,
    IsOptional
} from 'class-validator';
import validateConfig from 'utils/validate-config';
import { RedisConfig } from '../types/redis-config.type';

class EnvironmentVariablesValidator {

    @IsOptional()
    @IsString()
    REDIS_HOST: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(65535)
    REDIS_PORT: number;

    @IsOptional()
    @IsString()
    REDIS_USERNAME: string;

    @IsOptional()
    @IsString()
    REDIS_PASSWORD: string;
}

export default registerAs<RedisConfig>('redis', () => {
    validateConfig(process.env, EnvironmentVariablesValidator);

    return {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    };
});
