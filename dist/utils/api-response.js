"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, message = "Success", statusCode = 200, pagination) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(pagination ? { pagination } : {}),
    });
}
function sendError(res, message = "Something went wrong", statusCode = 500, errors) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
}
//# sourceMappingURL=api-response.js.map