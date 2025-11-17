import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum } from 'modules/roles/roles.enum';

export class AssignRoleDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsEnum(RoleEnum)
    @IsNotEmpty()
    roleId: RoleEnum;
}
