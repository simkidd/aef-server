"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const auditLog_model_js_1 = require("../models/auditLog.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class AnnouncementController {
    // Announcements
    static getAnnouncements = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, programId, cohortId } = req.query;
        const filter = { isActive: true };
        // Filter by relevance
        if (centreId || programId || cohortId) {
            filter.$or = [
                { scopeType: 'GLOBAL' },
                { targetCentreId: centreId },
                { targetProgramId: programId },
                { targetCohortId: cohortId },
            ];
        }
        const announcements = await auditLog_model_js_1.Announcement.find(filter)
            .populate('publishedBy', 'firstName lastName email')
            .populate('targetCentreId', 'name centreCode')
            .populate('targetProgramId', 'title')
            .populate('targetCohortId', 'name')
            .sort({ publishedAt: -1 });
        (0, index_js_1.sendSuccess)(res, announcements);
    });
    static createAnnouncement = (0, index_js_1.asyncHandler)(async (req, res) => {
        const announcement = await auditLog_model_js_1.Announcement.create({
            ...req.body,
            publishedBy: req.user?.userId,
            publishedAt: new Date(),
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ANNOUNCEMENT_PUBLISHED',
            entityType: 'Announcement',
            entityId: announcement._id.toString(),
            centreId: announcement.targetCentreId?.toString(),
            programId: announcement.targetProgramId?.toString(),
            cohortId: announcement.targetCohortId?.toString(),
            afterState: announcement.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, announcement, 'Announcement published', 201);
    });
    // In-app Notifications
    static getMyNotifications = (0, index_js_1.asyncHandler)(async (req, res) => {
        if (!req.user?.userId) {
            throw new index_js_1.AppError('Unauthorized', 401);
        }
        const notifications = await auditLog_model_js_1.Notification.find({ recipientUserId: req.user.userId }).sort({ createdAt: -1 }).limit(50);
        const unreadCount = await auditLog_model_js_1.Notification.countDocuments({ recipientUserId: req.user.userId, isRead: false });
        (0, index_js_1.sendSuccess)(res, { notifications, unreadCount });
    });
    static markNotificationRead = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const notification = await auditLog_model_js_1.Notification.findByIdAndUpdate(id, { isRead: true, readAt: new Date() }, { new: true });
        if (!notification) {
            throw new index_js_1.AppError('Notification not found', 404);
        }
        (0, index_js_1.sendSuccess)(res, notification, 'Notification marked as read');
    });
}
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map