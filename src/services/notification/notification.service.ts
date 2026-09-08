import { Notification } from '../../models/auditLog.model.js';

export class NotificationService {
  public static async send(params: {
    recipientUserId: string;
    title: string;
    message: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
    actionUrl?: string;
  }) {
    try {
      return await Notification.create({
        recipientUserId: params.recipientUserId,
        title: params.title,
        message: params.message,
        type: params.type || 'INFO',
        actionUrl: params.actionUrl,
        isRead: false,
      });
    } catch (err) {
      console.error('[NotificationService Error] Failed to create notification:', err);
      return null;
    }
  }

  public static async sendBatch(params: {
    recipientUserIds: string[];
    title: string;
    message: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
    actionUrl?: string;
  }) {
    const docs = params.recipientUserIds.map((userId) => ({
      recipientUserId: userId,
      title: params.title,
      message: params.message,
      type: params.type || 'INFO',
      actionUrl: params.actionUrl,
      isRead: false,
    }));
    return await Notification.insertMany(docs);
  }
}
