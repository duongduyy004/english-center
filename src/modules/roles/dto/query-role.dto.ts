import { Role } from "../role.domain";

export class FilterRoleDto {
    name?: string;
    isStaff?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
}

export class SortRoleDto {
    orderBy: keyof Role;
    order: 'ASC' | 'DESC';
}
