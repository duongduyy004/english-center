import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignPermissionsDto {
    @IsNotEmpty()
    @IsInt()
    roleId: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    permissionIds: number[];
}
