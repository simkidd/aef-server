"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// Thrown deliberately from controllers/services for expected error cases
// (not found, forbidden, bad input, etc). The centralized error handler
// middleware knows how to read `statusCode` off of this and respond
// consistently, while unexpected errors fall through as generic 500s.
class AppError extends Error {
    statusCode;
    isOperational;
    errorCode;
    constructor(message, statusCode = 400, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        if (errorCode !== undefined)
            this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map