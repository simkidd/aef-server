import multer from "multer";
import { AppError } from "../utils/app-error.js";

export const uploadGalleryImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(
        new AppError("Only image files are allowed.", 400) as unknown as null,
        false,
      );
      return;
    }
    cb(null, true);
  },
}).single("image");
