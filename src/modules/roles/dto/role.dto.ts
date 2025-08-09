import { IsNumber } from 'class-validator';

export class RoleDto {
    @IsNumber()
    id: number | string;
}
