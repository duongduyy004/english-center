import { IsNotEmpty, IsString, Matches } from "class-validator";
import { PASSWORD_REGEX } from "utils/constants";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    @Matches(PASSWORD_REGEX)
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @Matches(PASSWORD_REGEX)
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;
}
