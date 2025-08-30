import { IsNotEmpty, IsString } from "class-validator";

export class UploadAvatarDto {
    @IsString()
    @IsNotEmpty()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    publicId: string;
}