import { registerAs } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';

export class AwsConfig {
    @IsString()
    accessKeyId: string;

    @IsString()
    secretAccessKey: string;

    @IsString()
    region: string;

    @IsOptional()
    @IsString()
    bucketName?: string;
}

export default registerAs('aws', () => ({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
}));
