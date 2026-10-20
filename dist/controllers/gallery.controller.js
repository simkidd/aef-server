"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const galleryPhoto_model_js_1 = require("../models/galleryPhoto.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
class GalleryController {
    /**
     * Public: Get active gallery photographs with pagination
     * Query options: ?category=...&featured=true&page=1&limit=12
     */
    static getPublicPhotos = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { category, featured, limit = 12, page = 1 } = req.query;
        const filter = { isActive: true };
        if (category && typeof category === 'string' && category !== 'All') {
            filter.category = category;
        }
        if (featured === 'true') {
            filter.isFeatured = true;
        }
        const result = await (0, index_js_1.paginate)(galleryPhoto_model_js_1.GalleryPhoto, filter, {
            page: page,
            limit: limit,
            sort: { sortOrder: 1, createdAt: -1 },
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Gallery photos retrieved successfully', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    /**
     * Admin: Get all gallery photos including drafts & archived
     */
    static getAdminPhotos = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { search, category, status } = req.query;
        const filter = {};
        if (search && typeof search === 'string') {
            const regex = new RegExp(search, 'i');
            filter.$or = [{ title: regex }, { location: regex }, { category: regex }];
        }
        if (category && typeof category === 'string' && category !== 'All') {
            filter.category = category;
        }
        if (status === 'active') {
            filter.isActive = true;
        }
        else if (status === 'inactive') {
            filter.isActive = false;
        }
        const photos = await galleryPhoto_model_js_1.GalleryPhoto.find(filter)
            .sort({ sortOrder: 1, createdAt: -1 })
            .populate('uploadedBy', 'firstName lastName email')
            .lean();
        (0, index_js_1.sendSuccess)(res, photos, 'Admin gallery photos retrieved');
    });
    /**
     * Get single photo by ID
     */
    static getPhotoById = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const photo = await galleryPhoto_model_js_1.GalleryPhoto.findById(id).lean();
        if (!photo) {
            throw new index_js_1.AppError('Gallery photograph not found', 404);
        }
        (0, index_js_1.sendSuccess)(res, photo, 'Photograph retrieved');
    });
    /**
     * Admin: Create new gallery photo
     * Receives image file from request and uploads directly to Cloudinary on the backend
     */
    static createPhoto = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { title, description, category, location, date, isFeatured, isActive, sortOrder, } = req.body;
        if (!title) {
            throw new index_js_1.AppError('Photograph title is required', 400);
        }
        const fileToUpload = req.file || req.body.image;
        if (!fileToUpload) {
            throw new index_js_1.AppError('Please attach an image file for this photograph', 400);
        }
        // Upload is executed directly on the backend
        const uploadResult = await (0, cloudinary_js_1.uploadToCloudinary)(fileToUpload, {
            folder: 'adele-foundation/gallery',
        });
        const imageUrl = uploadResult.secure_url;
        const publicId = uploadResult.public_id;
        const photo = await galleryPhoto_model_js_1.GalleryPhoto.create({
            title: title.trim(),
            description: description ? description.trim() : undefined,
            imageUrl,
            publicId,
            category: category ? category.trim() : 'General',
            location: location ? location.trim() : 'Adele Training Hub',
            date: date ? date.trim() : `Cohort ${new Date().getFullYear()}`,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
            sortOrder: sortOrder ? Number(sortOrder) : 0,
            uploadedBy: req.user?.userId,
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'GALLERY_PHOTO_CREATED',
            entityType: 'GalleryPhoto',
            entityId: photo._id.toString(),
            afterState: photo.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, photo, 'Gallery photograph created successfully', 201);
    });
    /**
     * Admin: Update gallery photo
     */
    static updatePhoto = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const photo = await galleryPhoto_model_js_1.GalleryPhoto.findById(id);
        if (!photo) {
            throw new index_js_1.AppError('Gallery photograph not found', 404);
        }
        const beforeState = photo.toObject();
        // If a new image file is provided, upload on backend and remove old Cloudinary asset
        const newFile = req.file || req.body.image;
        if (newFile) {
            if (photo.publicId) {
                await (0, cloudinary_js_1.deleteFromCloudinary)(photo.publicId);
            }
            const uploadResult = await (0, cloudinary_js_1.uploadToCloudinary)(newFile, {
                folder: 'adele-foundation/gallery',
            });
            photo.imageUrl = uploadResult.secure_url;
            photo.publicId = uploadResult.public_id;
        }
        const allowedFields = [
            'title',
            'description',
            'category',
            'location',
            'date',
            'sortOrder',
        ];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                photo[field] = req.body[field];
            }
        });
        if (req.body.isFeatured !== undefined) {
            photo.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
        }
        if (req.body.isActive !== undefined) {
            photo.isActive = req.body.isActive === 'true' || req.body.isActive === true;
        }
        await photo.save();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'GALLERY_PHOTO_UPDATED',
            entityType: 'GalleryPhoto',
            entityId: photo._id.toString(),
            beforeState,
            afterState: photo.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, photo, 'Gallery photograph updated successfully');
    });
    /**
     * Admin: Delete gallery photo
     */
    static deletePhoto = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const photo = await galleryPhoto_model_js_1.GalleryPhoto.findById(id);
        if (!photo) {
            throw new index_js_1.AppError('Gallery photograph not found', 404);
        }
        const beforeState = photo.toObject();
        // Destroy Cloudinary asset on deletion
        if (photo.publicId) {
            await (0, cloudinary_js_1.deleteFromCloudinary)(photo.publicId);
        }
        await photo.deleteOne();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'GALLERY_PHOTO_DELETED',
            entityType: 'GalleryPhoto',
            entityId: id,
            beforeState,
        });
        (0, index_js_1.sendSuccess)(res, { deletedId: id, publicId: photo.publicId }, 'Gallery photograph deleted');
    });
}
exports.GalleryController = GalleryController;
//# sourceMappingURL=gallery.controller.js.map