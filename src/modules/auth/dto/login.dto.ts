import { PASSWORD_REGEX } from "@/utils/constants";
import { IsEmail, Matches } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;

    @Matches(PASSWORD_REGEX)
    password: string;
}