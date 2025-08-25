import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CloudinaryConfig {
    @IsString()
    cloudName: string;

    @IsString()
    apiKey: string;

    @IsString()
    apiSecret: string;

    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    secure?: boolean;

    @IsOptional()
    @IsString()
    folder?: string;
}

export default registerAs('cloudinary', () => ({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    url: process.env.CLOUDINARY_URL,
    secure: process.env.CLOUDINARY_SECURE === 'true',
    folder: process.env.CLOUDINARY_FOLDER || 'english-center',
}));
