import mongoose, { Document, Schema } from 'mongoose';
import { IAnnouncement, INotification, IAuditLog } from '../interfaces/audit.interface.js';

export interface IAnnouncementDocument extends Omit<IAnnouncement, '_id'>, Document {}
export interface INotificationDocument extends Omit<INotification, '_id'>, Document {}
export interface IAuditLogDocument extends Omit<IAuditLog, '_id'>, Document {}

const AnnouncementSchema = new Schema<IAnnouncementDocument>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    scopeType: {
      type: String,
      enum: ['GLOBAL', 'CENTRE', 'PROGRAM', 'COHORT', 'SKILL_AREA'],
      default: 'GLOBAL',
      index: true,
    },
    targetCentreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre' },
    targetProgramId: { type: Schema.Types.ObjectId, ref: 'Program' },
    targetCohortId: { type: Schema.Types.ObjectId, ref: 'Cohort' },
    targetSkillAreaId: { type: Schema.Types.ObjectId, ref: 'SkillArea' },
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model<IAnnouncementDocument>('Announcement', AnnouncementSchema);

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipientUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['INFO', 'SUCCESS', 'WARNING', 'ALERT'],
      default: 'INFO',
    },
    actionUrl: { type: String },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    centreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre', index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', index: true },
    beforeState: { type: Schema.Types.Mixed },
    afterState: { type: Schema.Types.Mixed },
    reason: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);

const OrgSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['General', 'Enrollment', 'Attendance', 'Security', 'Notifications', 'Biometrics'],
      default: 'General',
    },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const OrgSettings = mongoose.model('OrgSettings', OrgSettingsSchema);
