import { Permission } from "../permission.domain";

export class FilterPermissionDto {
    path?: string;
    method?: string;
    description?: string;
    module?: string;
    version?: number;
}

export class SortPermissionDto {
    orderBy: keyof Permission;
    order: 'ASC' | 'DESC';
}
