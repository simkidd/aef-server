"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const index_js_1 = require("../utils/index.js");
const env_js_1 = require("../config/env.js");
const errorHandler = (err, req, res, next) => {
    index_js_1.logger.error(`${req.method} ${req.originalUrl}: ${err.message || err}`, {
        stack: err.stack,
    });
    // AppError (Operational expected error)
    if (err instanceof index_js_1.AppError || err.isOperational) {
        (0, index_js_1.sendError)(res, err.message, err.statusCode || 400, err.errorCode);
        return;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        (0, index_js_1.sendError)(res, `A record with this ${field} already exists.`, 409);
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        (0, index_js_1.sendError)(res, 'Validation Error', 400, messages);
        return;
    }
    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        (0, index_js_1.sendError)(res, `Invalid ID format: ${err.value}`, 400);
        return;
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    (0, index_js_1.sendError)(res, message, statusCode, !env_js_1.ENV.IS_PROD ? { stack: err.stack } : undefined);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    (0, index_js_1.sendError)(res, `Resource not found: ${req.method} ${req.originalUrl}`, 404);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map