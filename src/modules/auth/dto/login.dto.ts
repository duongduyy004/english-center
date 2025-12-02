import { PASSWORD_REGEX } from "@/utils/constants";
import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(PASSWORD_REGEX)
    @IsNotEmpty()
    password: string;
}