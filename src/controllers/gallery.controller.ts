import { Request, Response } from 'express';
import { GalleryPhoto } from '../models/galleryPhoto.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

export class GalleryController {
  /**
   * Public: Get active gallery photographs with pagination
   * Query options: ?category=...&featured=true&page=1&limit=12
   */
  public static getPublicPhotos = asyncHandler(async (req: Request, res: Response) => {
    const { category, featured, limit = 12, page = 1 } = req.query;
    const filter: Record<string, any> = { isActive: true };

    if (category && typeof category === 'string' && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const result = await paginate(GalleryPhoto, filter, {
      page: page as string,
      limit: limit as string,
      sort: { sortOrder: 1, createdAt: -1 },
    });

    sendSuccess(res, result.docs, 'Gallery photos retrieved successfully', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  /**
   * Admin: Get all gallery photos including drafts & archived
   */
  public static getAdminPhotos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { search, category, status } = req.query;
    const filter: Record<string, any> = {};

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { location: regex }, { category: regex }];
    }

    if (category && typeof category === 'string' && category !== 'All') {
      filter.category = category;
    }

    if (status === 'active') {
      filter.isActive = true;
    } else if (status === 'inactive') {
      filter.isActive = false;
    }

    const photos = await GalleryPhoto.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .populate('uploadedBy', 'firstName lastName email')
      .lean();

    sendSuccess(res, photos, 'Admin gallery photos retrieved');
  });

  /**
   * Get single photo by ID
   */
  public static getPhotoById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const photo = await GalleryPhoto.findById(id).lean();

    if (!photo) {
      throw new AppError('Gallery photograph not found', 404);
    }

    sendSuccess(res, photo, 'Photograph retrieved');
  });

  /**
   * Admin: Create new gallery photo
   * Receives image file from request and uploads directly to Cloudinary on the backend
   */
  public static createPhoto = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      title,
      description,
      category,
      location,
      date,
      isFeatured,
      isActive,
      sortOrder,
    } = req.body;

    if (!title) {
      throw new AppError('Photograph title is required', 400);
    }

    const fileToUpload = req.file || req.body.image;
    if (!fileToUpload) {
      throw new AppError('Please attach an image file for this photograph', 400);
    }

    // Upload is executed directly on the backend
    const uploadResult = await uploadToCloudinary(fileToUpload, {
      folder: 'adele-foundation/gallery',
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    const photo = await GalleryPhoto.create({
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

    await AuditService.log({
      req,
      action: 'GALLERY_PHOTO_CREATED',
      entityType: 'GalleryPhoto',
      entityId: photo._id.toString(),
      afterState: photo.toObject(),
    });

    sendSuccess(res, photo, 'Gallery photograph created successfully', 201);
  });

  /**
   * Admin: Update gallery photo
   */
  public static updatePhoto = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const photo = await GalleryPhoto.findById(id);

    if (!photo) {
      throw new AppError('Gallery photograph not found', 404);
    }

    const beforeState = photo.toObject();

    // If a new image file is provided, upload on backend and remove old Cloudinary asset
    const newFile = req.file || req.body.image;
    if (newFile) {
      if (photo.publicId) {
        await deleteFromCloudinary(photo.publicId);
      }
      const uploadResult = await uploadToCloudinary(newFile, {
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
        (photo as any)[field] = req.body[field];
      }
    });

    if (req.body.isFeatured !== undefined) {
      photo.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;
    }

    if (req.body.isActive !== undefined) {
      photo.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

    await photo.save();

    await AuditService.log({
      req,
      action: 'GALLERY_PHOTO_UPDATED',
      entityType: 'GalleryPhoto',
      entityId: photo._id.toString(),
      beforeState,
      afterState: photo.toObject(),
    });

    sendSuccess(res, photo, 'Gallery photograph updated successfully');
  });

  /**
   * Admin: Delete gallery photo
   */
  public static deletePhoto = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const photo = await GalleryPhoto.findById(id);

    if (!photo) {
      throw new AppError('Gallery photograph not found', 404);
    }

    const beforeState = photo.toObject();

    // Destroy Cloudinary asset on deletion
    if (photo.publicId) {
      await deleteFromCloudinary(photo.publicId);
    }

    await photo.deleteOne();

    await AuditService.log({
      req,
      action: 'GALLERY_PHOTO_DELETED',
      entityType: 'GalleryPhoto',
      entityId: id,
      beforeState,
    });

    sendSuccess(res, { deletedId: id, publicId: photo.publicId }, 'Gallery photograph deleted');
  });
}
