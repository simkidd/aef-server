import { Router } from 'express';
import { GalleryController } from '../controllers/gallery.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { uploadGalleryImage } from '../middlewares/upload.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Public routes
router.get('/', GalleryController.getPublicPhotos);
router.get('/view/:id', GalleryController.getPhotoById);

// Admin routes (requires authentication & management permission)
router.get('/admin/all', authenticate, GalleryController.getAdminPhotos);

// Create photo with file upload handled on the backend
router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.GALLERY_MANAGE),
  uploadGalleryImage,
  GalleryController.createPhoto
);

// Update photo with optional new image file handled on the backend
router.put(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.GALLERY_MANAGE),
  uploadGalleryImage,
  GalleryController.updatePhoto
);
router.delete(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.GALLERY_MANAGE),
  GalleryController.deletePhoto
);

export const galleryRoutes = router;
