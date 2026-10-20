import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
/**
 * Upload an image (Multer file, Buffer, base64 data URI, or URL) directly to Cloudinary
 */
export declare function uploadToCloudinary(file: any, options?: {
    folder?: string;
    publicId?: string;
    transformation?: any[];
}): Promise<UploadApiResponse>;
/**
 * Safely delete an image asset from Cloudinary by its public ID
 */
export declare function deleteFromCloudinary(publicId?: string): Promise<{
    result: string;
} | null>;
export { cloudinary };
