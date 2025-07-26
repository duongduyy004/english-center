import { plainToInstance, Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { User } from "@/modules/users/user.domain";

export class FilterUserDto {
    @IsString()
    name: string;
}

export class SortUserDto {
    @Type(() => String)
    @IsString()
    orderBy: keyof User;

    @IsString()
    order: string;
}
