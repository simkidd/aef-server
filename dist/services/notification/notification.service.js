"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const auditLog_model_js_1 = require("../../models/auditLog.model.js");
class NotificationService {
    static async send(params) {
        try {
            return await auditLog_model_js_1.Notification.create({
                recipientUserId: params.recipientUserId,
                title: params.title,
                message: params.message,
                type: params.type || 'INFO',
                actionUrl: params.actionUrl,
                isRead: false,
            });
        }
        catch (err) {
            console.error('[NotificationService Error] Failed to create notification:', err);
            return null;
        }
    }
    static async sendBatch(params) {
        const docs = params.recipientUserIds.map((userId) => ({
            recipientUserId: userId,
            title: params.title,
            message: params.message,
            type: params.type || 'INFO',
            actionUrl: params.actionUrl,
            isRead: false,
        }));
        return await auditLog_model_js_1.Notification.insertMany(docs);
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map