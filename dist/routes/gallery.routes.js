"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryRoutes = void 0;
const express_1 = require("express");
const gallery_controller_js_1 = require("../controllers/gallery.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const upload_middleware_js_1 = require("../middlewares/upload.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', gallery_controller_js_1.GalleryController.getPublicPhotos);
router.get('/view/:id', gallery_controller_js_1.GalleryController.getPhotoById);
// Admin routes (requires authentication & management permission)
router.get('/admin/all', auth_middleware_js_1.authenticate, gallery_controller_js_1.GalleryController.getAdminPhotos);
// Create photo with file upload handled on the backend
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.GALLERY_MANAGE), upload_middleware_js_1.uploadGalleryImage, gallery_controller_js_1.GalleryController.createPhoto);
// Update photo with optional new image file handled on the backend
router.put('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.GALLERY_MANAGE), upload_middleware_js_1.uploadGalleryImage, gallery_controller_js_1.GalleryController.updatePhoto);
router.delete('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.GALLERY_MANAGE), gallery_controller_js_1.GalleryController.deletePhoto);
exports.galleryRoutes = router;
//# sourceMappingURL=gallery.routes.js.map