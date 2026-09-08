"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementRoutes = void 0;
const express_1 = require("express");
const announcement_controller_js_1 = require("../controllers/announcement.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Announcements
router.get('/', auth_middleware_js_1.authenticate, announcement_controller_js_1.AnnouncementController.getAnnouncements);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ANNOUNCEMENTS_MANAGE), announcement_controller_js_1.AnnouncementController.createAnnouncement);
// User Notifications
router.get('/notifications/my', auth_middleware_js_1.authenticate, announcement_controller_js_1.AnnouncementController.getMyNotifications);
router.put('/notifications/:id/read', auth_middleware_js_1.authenticate, announcement_controller_js_1.AnnouncementController.markNotificationRead);
exports.announcementRoutes = router;
//# sourceMappingURL=announcement.routes.js.map