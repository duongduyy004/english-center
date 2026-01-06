import { IsString, IsNotEmpty, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateFooterSettingsDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    companyName: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    address: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    facebookUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    youtubeUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    zaloUrl?: string;

    @IsString()
    @IsOptional()
    mapEmbedUrl?: string;
}

