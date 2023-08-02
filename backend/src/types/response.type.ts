export type PagingResponse<T> = {
    total_page: number;
    total_record: number;
    data: T;
};
