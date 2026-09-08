import { Model, PopulateOptions } from "mongoose";
export interface PaginationResult<T> {
    docs: T[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}
export interface PaginateOptions {
    page?: string | number;
    limit?: string | number;
    sort?: any;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
    select?: string | Record<string, number>;
}
export declare function paginate<T>(model: Model<T>, filter?: Record<string, any>, options?: PaginateOptions): Promise<PaginationResult<T>>;
