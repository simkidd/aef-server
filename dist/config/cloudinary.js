"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const env_js_1 = require("./env.js");
const logger_js_1 = require("../utils/logger.js");
// Configure Cloudinary with environment credentials
cloudinary_1.v2.config({
    cloud_name: env_js_1.ENV.CLOUDINARY_CLOUD_NAME,
    api_key: env_js_1.ENV.CLOUDINARY_API_KEY,
    api_secret: env_js_1.ENV.CLOUDINARY_API_SECRET,
    secure: true,
});
/**
 * Upload an image (Multer file, Buffer, base64 data URI, or URL) directly to Cloudinary
 */
async function uploadToCloudinary(file, options = {}) {
    const { folder = 'adele-foundation/gallery', publicId, transformation } = options;
    // 1. If Multer memoryStorage file (has buffer)
    if (file && typeof file === 'object' && file.buffer && Buffer.isBuffer(file.buffer)) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                public_id: publicId,
                transformation,
                resource_type: 'image',
            }, (error, result) => {
                if (error || !result) {
                    return reject(error || new Error('Cloudinary upload stream failed'));
                }
                resolve(result);
            });
            uploadStream.end(file.buffer);
        });
    }
    // 2. If Multer diskStorage file (has path)
    if (file && typeof file === 'object' && typeof file.path === 'string') {
        return cloudinary_1.v2.uploader.upload(file.path, {
            folder,
            public_id: publicId,
            transformation,
            resource_type: 'image',
        });
    }
    // 3. If raw Buffer
    if (Buffer.isBuffer(file)) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                public_id: publicId,
                transformation,
                resource_type: 'image',
            }, (error, result) => {
                if (error || !result) {
                    return reject(error || new Error('Cloudinary upload stream failed'));
                }
                resolve(result);
            });
            uploadStream.end(file);
        });
    }
    // 4. If string (base64, data URI, or remote URL)
    return cloudinary_1.v2.uploader.upload(file, {
        folder,
        public_id: publicId,
        transformation,
        resource_type: 'image',
    });
}
/**
 * Safely delete an image asset from Cloudinary by its public ID
 */
async function deleteFromCloudinary(publicId) {
    if (!publicId ||
        publicId.startsWith("seed_") ||
        publicId.startsWith("fallback_")) {
        return null;
    }
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        logger_js_1.logger.info(`Cloudinary: Deleted asset ${publicId} with result: ${result.result}`);
        return result;
    }
    catch (error) {
        logger_js_1.logger.error(`Cloudinary: Failed to delete asset ${publicId}:`, error);
        return null;
    }
}
//# sourceMappingURL=cloudinary.js.map