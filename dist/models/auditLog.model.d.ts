import mongoose, { Document } from 'mongoose';
import { IAnnouncement, INotification, IAuditLog } from '../interfaces/audit.interface.js';
export interface IAnnouncementDocument extends Omit<IAnnouncement, '_id'>, Document {
}
export interface INotificationDocument extends Omit<INotification, '_id'>, Document {
}
export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {
}
export declare const Announcement: mongoose.Model<IAnnouncementDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAnnouncementDocument, {}, {}> & IAnnouncementDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Notification: mongoose.Model<INotificationDocument, {}, {}, {}, mongoose.Document<unknown, {}, INotificationDocument, {}, {}> & INotificationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const AuditLog: mongoose.Model<IAuditLogDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLogDocument, {}, {}> & IAuditLogDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const OrgSettings: mongoose.Model<{
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    value: any;
    key: string;
    category: "Enrollment" | "General" | "Attendance" | "Security" | "Notifications" | "Biometrics";
    description?: string | null | undefined;
    lastUpdatedBy?: mongoose.Types.ObjectId | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
