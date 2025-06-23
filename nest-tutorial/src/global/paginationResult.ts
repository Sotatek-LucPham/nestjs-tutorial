export interface PaginationResult<T> {
    data: T[];
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}