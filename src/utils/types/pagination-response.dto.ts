export interface PaginationResponseDto<T> {
    meta: {
        page: number,
        limit: number,
        totalPages: number,
        totalItems: number
    }
    result: T[];
}