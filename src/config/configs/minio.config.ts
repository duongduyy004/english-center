import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class MinioConfig {
    @IsString()
    accessKey: string;

    @IsString()
    secretKey: string;

    @IsString()
    endpoint: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    port: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    useSSL: boolean;

    @IsString()
    bucketName: string;
}

export default registerAs('minio', () => ({
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    endpoint: process.env.MINIO_ENDPOINT,
    port: process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT) : 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    bucketName: process.env.MINIO_BUCKET_NAME,
}));
