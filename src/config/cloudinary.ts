import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { ENV } from "./env.js";
import { logger } from "../utils/logger.js";

// Configure Cloudinary with environment credentials
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload an image (Multer file, Buffer, base64 data URI, or URL) directly to Cloudinary
 */
export async function uploadToCloudinary(
  file: any,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: any[];
  } = {}
): Promise<UploadApiResponse> {
  const { folder = 'adele-foundation/gallery', publicId, transformation } = options;

  // 1. If Multer memoryStorage file (has buffer)
  if (file && typeof file === 'object' && file.buffer && Buffer.isBuffer(file.buffer)) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          transformation,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload stream failed'));
          }
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // 2. If Multer diskStorage file (has path)
  if (file && typeof file === 'object' && typeof file.path === 'string') {
    return cloudinary.uploader.upload(file.path, {
      folder,
      public_id: publicId,
      transformation,
      resource_type: 'image',
    });
  }

  // 3. If raw Buffer
  if (Buffer.isBuffer(file)) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          transformation,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload stream failed'));
          }
          resolve(result);
        }
      );
      uploadStream.end(file);
    });
  }

  // 4. If string (base64, data URI, or remote URL)
  return cloudinary.uploader.upload(file as string, {
    folder,
    public_id: publicId,
    transformation,
    resource_type: 'image',
  });
}

/**
 * Safely delete an image asset from Cloudinary by its public ID
 */
export async function deleteFromCloudinary(
  publicId?: string,
): Promise<{ result: string } | null> {
  if (
    !publicId ||
    publicId.startsWith("seed_") ||
    publicId.startsWith("fallback_")
  ) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(
      `Cloudinary: Deleted asset ${publicId} with result: ${result.result}`,
    );
    return result;
  } catch (error) {
    logger.error(`Cloudinary: Failed to delete asset ${publicId}:`, error);
    return null;
  }
}

export { cloudinary };
