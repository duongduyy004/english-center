import { Role } from "../role.domain";

export class FilterRoleDto {
    name?: string;
}

export class SortRoleDto {
    orderBy: keyof Role;
    order: 'ASC' | 'DESC';
}
