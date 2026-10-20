export declare class GalleryController {
    /**
     * Public: Get active gallery photographs with pagination
     * Query options: ?category=...&featured=true&page=1&limit=12
     */
    static getPublicPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Admin: Get all gallery photos including drafts & archived
     */
    static getAdminPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Get single photo by ID
     */
    static getPhotoById: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Admin: Create new gallery photo
     * Receives image file from request and uploads directly to Cloudinary on the backend
     */
    static createPhoto: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Admin: Update gallery photo
     */
    static updatePhoto: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    /**
     * Admin: Delete gallery photo
     */
    static deletePhoto: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
}
