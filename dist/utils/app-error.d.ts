export declare class AppError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly errorCode?: string;
    constructor(message: string, statusCode?: number, errorCode?: string);
}
