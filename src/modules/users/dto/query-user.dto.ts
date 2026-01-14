import { User } from "../user.domain";

export class FilterUserDto {
    name?: string;
    email?: string;
}

export class SortUserDto {
    orderBy: keyof User;
    order: 'ASC' | 'DESC';
}
