"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadGalleryImage = void 0;
const multer_1 = __importDefault(require("multer"));
const app_error_js_1 = require("../utils/app-error.js");
exports.uploadGalleryImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new app_error_js_1.AppError("Only image files are allowed.", 400), false);
            return;
        }
        cb(null, true);
    },
}).single("image");
//# sourceMappingURL=upload.middleware.js.map