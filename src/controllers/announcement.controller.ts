import { Response } from 'express';
import { Announcement, Notification } from '../models/auditLog.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError } from '../utils/index.js';

export class AnnouncementController {
  // Announcements
  public static getAnnouncements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { centreId, programId, cohortId } = req.query;
    const filter: any = { isActive: true };

    // Filter by relevance
    if (centreId || programId || cohortId) {
      filter.$or = [
        { scopeType: 'GLOBAL' },
        { targetCentreId: centreId },
        { targetProgramId: programId },
        { targetCohortId: cohortId },
      ];
    }

    const announcements = await Announcement.find(filter)
      .populate('publishedBy', 'firstName lastName email')
      .populate('targetCentreId', 'name centreCode')
      .populate('targetProgramId', 'title')
      .populate('targetCohortId', 'name')
      .sort({ publishedAt: -1 });

    sendSuccess(res, announcements);
  });

  public static createAnnouncement = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const announcement = await Announcement.create({
      ...req.body,
      publishedBy: req.user?.userId,
      publishedAt: new Date(),
    });

    await AuditService.log({
      req,
      action: 'ANNOUNCEMENT_PUBLISHED',
      entityType: 'Announcement',
      entityId: announcement._id.toString(),
      centreId: announcement.targetCentreId?.toString(),
      programId: announcement.targetProgramId?.toString(),
      cohortId: announcement.targetCohortId?.toString(),
      afterState: announcement.toObject(),
    });

    sendSuccess(res, announcement, 'Announcement published', 201);
  });

  // In-app Notifications
  public static getMyNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.userId) {
      throw new AppError('Unauthorized', 401);
    }
    const notifications = await Notification.find({ recipientUserId: req.user.userId }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ recipientUserId: req.user.userId, isRead: false });

    sendSuccess(res, { notifications, unreadCount });
  });

  public static markNotificationRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true, readAt: new Date() }, { new: true });
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    sendSuccess(res, notification, 'Notification marked as read');
  });
}
