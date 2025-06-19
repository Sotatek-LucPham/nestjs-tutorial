export class ResponseData<D> {
    data: D | D[] | null;
    statusCode: number;
    message: string;

    constructor(data: D | D[] | null, statusCode: number, message: string) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;

        return this;
    }
}

export interface PaginationResult<T> {
    data: T[];
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
}