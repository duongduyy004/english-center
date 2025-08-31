import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateIntroductionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(100)
    key: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(5000)
    value: string;
}
