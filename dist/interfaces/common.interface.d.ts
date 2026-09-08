import { ScopeType } from '../constants/permissions.js';
export interface BaseEntity {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface UserContext {
    userId: string;
    email: string;
    name: string;
    roles: string[];
    permissions: string[];
    scopes: {
        type: ScopeType;
        targetId?: string;
    }[];
    beneficiaryId?: string;
    staffId?: string;
}
