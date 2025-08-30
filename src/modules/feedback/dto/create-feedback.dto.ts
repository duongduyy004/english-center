import { IsString, IsUrl, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateFeedbackDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(1000)
    description: string;

    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    publicId: string;

    @IsUrl()
    @IsNotEmpty()
    socialUrl: string;
}
