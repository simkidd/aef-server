export declare class NotificationService {
    static send(params: {
        recipientUserId: string;
        title: string;
        message: string;
        type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
        actionUrl?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../../models/auditLog.model.js").INotificationDocument, {}, {}> & import("../../models/auditLog.model.js").INotificationDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    static sendBatch(params: {
        recipientUserIds: string[];
        title: string;
        message: string;
        type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
        actionUrl?: string;
    }): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("../../models/auditLog.model.js").INotificationDocument, {}, {}> & import("../../models/auditLog.model.js").INotificationDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, Omit<{
        recipientUserId: string;
        title: string;
        message: string;
        type: "INFO" | "SUCCESS" | "WARNING" | "ALERT";
        actionUrl: string | undefined;
        isRead: boolean;
    }, "_id">>[]>;
}
