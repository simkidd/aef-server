"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrgSettings = exports.AuditLog = exports.Notification = exports.Announcement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AnnouncementSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    scopeType: {
        type: String,
        enum: ['GLOBAL', 'CENTRE', 'PROGRAM', 'COHORT', 'SKILL_AREA'],
        default: 'GLOBAL',
        index: true,
    },
    targetCentreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre' },
    targetProgramId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program' },
    targetCohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort' },
    targetSkillAreaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SkillArea' },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal',
    },
    publishedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });
exports.Announcement = mongoose_1.default.model('Announcement', AnnouncementSchema);
const NotificationSchema = new mongoose_1.Schema({
    recipientUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
}, { timestamps: true });
exports.Notification = mongoose_1.default.model('Notification', NotificationSchema);
const AuditLogSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    centreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre', index: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', index: true },
    beforeState: { type: mongoose_1.Schema.Types.Mixed },
    afterState: { type: mongoose_1.Schema.Types.Mixed },
    reason: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
exports.AuditLog = mongoose_1.default.model('AuditLog', AuditLogSchema);
const OrgSettingsSchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ['General', 'Enrollment', 'Attendance', 'Security', 'Notifications', 'Biometrics'],
        default: 'General',
    },
    lastUpdatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
exports.OrgSettings = mongoose_1.default.model('OrgSettings', OrgSettingsSchema);
//# sourceMappingURL=auditLog.model.js.map