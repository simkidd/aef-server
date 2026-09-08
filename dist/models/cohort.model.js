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
exports.TrainingCalendarEvent = exports.TrainingSession = exports.Cohort = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CohortSkillAreaConfigSchema = new mongoose_1.Schema({
    skillAreaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SkillArea",
        required: true,
    },
    skillName: { type: String },
    trainerStaffIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" }],
    assignedRoomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "RoomFacility" },
    daysOfWeek: [{ type: Number, required: true }], // 0=Sun, 1=Mon...
    startTime: { type: String, required: true, default: "09:00" },
    endTime: { type: String, required: true, default: "12:00" },
    durationWeeks: { type: Number, required: true, default: 8 },
    maxCapacity: { type: Number, required: true, default: 25 },
});
const TimetableSlotSchema = new mongoose_1.Schema({
    slotNumber: { type: Number, required: true }, // 1, 2, 3
    slotName: { type: String, required: true }, // "Morning Session", etc.
    startTime: { type: String, required: true, default: "08:30" },
    endTime: { type: String, required: true, default: "11:30" },
    daysOfWeek: [{ type: Number, required: true }], // 0=Sun, 1=Mon...
    skillAreaIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "SkillArea" }],
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "RoomFacility" },
    notes: { type: String },
});
const CohortSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    cohortCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    programId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Program",
        required: true,
        index: true,
    },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: [
            "upcoming",
            "enrolling",
            "in_progress",
            "assessments",
            "completed",
            "cancelled",
        ],
        lowercase: true,
        default: "upcoming",
        index: true,
    },
    maxCapacity: { type: Number, required: true, default: 30 },
    skillConfigs: [CohortSkillAreaConfigSchema],
    timetableStatus: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
        index: true,
    },
    timetablePublishedAt: { type: Date },
    timetableSlots: [TimetableSlotSchema],
    notes: { type: String },
}, { timestamps: true });
exports.Cohort = mongoose_1.default.model("Cohort", CohortSchema);
const TrainingSessionSchema = new mongoose_1.Schema({
    cohortId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Cohort",
        required: true,
        index: true,
    },
    programId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Program",
        required: true,
        index: true,
    },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    skillAreaId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SkillArea",
        required: true,
        index: true,
    },
    trainerStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff", index: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "RoomFacility" },
    sessionDate: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotNumber: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false, index: true },
    topic: { type: String },
    sessionType: {
        type: String,
        enum: [
            "Regular Practical",
            "Theory Lecture",
            "Workshop Lab",
            "Assessment",
            "Guest Lecture",
            "Rescheduled",
        ],
        default: "Regular Practical",
    },
    isCancelled: { type: Boolean, default: false },
    cancellationReason: { type: String },
    rescheduledToSessionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingSession",
    },
    attendanceProcessed: { type: Boolean, default: false },
}, { timestamps: true });
exports.TrainingSession = mongoose_1.default.model("TrainingSession", TrainingSessionSchema);
const TrainingCalendarEventSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    eventType: {
        type: String,
        enum: [
            "Public Holiday",
            "Centre Closed",
            "Trainer Unavailable",
            "Emergency Closure",
            "Weather-related cancellation",
            "Program Break",
            "Examination Day",
            "Assessment Day",
            "Rescheduled Training",
            "Other",
        ],
        required: true,
        index: true,
    },
    description: { type: String },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        index: true,
    },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program", index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Cohort", index: true },
    affectsAttendance: { type: Boolean, default: true },
    replacementTrainingDate: { type: Date },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.TrainingCalendarEvent = mongoose_1.default.model("TrainingCalendarEvent", TrainingCalendarEventSchema);
//# sourceMappingURL=cohort.model.js.map