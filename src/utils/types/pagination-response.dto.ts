import { User } from "@/users/user.domain";

export interface PaginationResponseDto {
    meta: {
        page: number,
        limit: number,
        totalPages: number,
        totalItems: number
    }
    result: User[];
}