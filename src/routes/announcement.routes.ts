import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Announcements
router.get('/', authenticate, AnnouncementController.getAnnouncements);
router.post('/', authenticate, requirePermission(PERMISSIONS.ANNOUNCEMENTS_MANAGE), AnnouncementController.createAnnouncement);

// User Notifications
router.get('/notifications/my', authenticate, AnnouncementController.getMyNotifications);
router.put('/notifications/:id/read', authenticate, AnnouncementController.markNotificationRead);

export const announcementRoutes = router;
