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
exports.AttendanceCorrection = exports.AttendanceRecord = exports.AttendancePolicy = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_js_1 = require("../constants/enums.js");
const AttendancePolicySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    scopeType: {
        type: String,
        enum: ['GLOBAL', 'PROGRAM', 'COHORT'],
        default: 'GLOBAL',
        index: true,
    },
    targetId: { type: mongoose_1.Schema.Types.ObjectId },
    defaultStartTime: { type: String, required: true, default: '09:00' },
    defaultEndTime: { type: String, required: true, default: '12:00' },
    gracePeriodMinutes: { type: Number, required: true, default: 15 },
    lateThresholdMinutes: { type: Number, required: true, default: 45 },
    minDailyDurationMinutes: { type: Number, required: true, default: 120 },
    requireClockOut: { type: Boolean, default: true },
    allowMultipleClockIns: { type: Boolean, default: true },
    minAttendancePercentForCertificate: { type: Number, default: 80 },
    lowAttendanceAlertThreshold: { type: Number, default: 75 },
    criticalAttendanceAlertThreshold: { type: Number, default: 60 },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
exports.AttendancePolicy = mongoose_1.default.model('AttendancePolicy', AttendancePolicySchema);
const ClockInEventSchema = new mongoose_1.Schema({
    timestamp: { type: Date, required: true },
    deviceId: { type: String, required: true },
    scanType: { type: String, enum: ['IN', 'OUT'], required: true },
});
const AttendanceRecordSchema = new mongoose_1.Schema({
    beneficiaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    enrollmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    sessionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingSession', index: true },
    date: { type: Date, required: true, index: true },
    status: {
        type: String,
        enum: Object.values(enums_js_1.AttendanceStatus),
        default: enums_js_1.AttendanceStatus.ABSENT,
        index: true,
    },
    firstClockIn: { type: Date },
    lastClockOut: { type: Date },
    clockInEvents: [ClockInEventSchema],
    durationMinutes: { type: Number, default: 0 },
    isLate: { type: Boolean, default: false },
    minutesLate: { type: Number, default: 0 },
    isExcused: { type: Boolean, default: false },
    excuseReason: { type: String },
    excuseApprovedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
    isManualCorrection: { type: Boolean, default: false },
    notes: { type: String },
}, { timestamps: true });
// Compound index to guarantee one attendance record per beneficiary per session/date
AttendanceRecordSchema.index({ beneficiaryId: 1, date: 1, cohortId: 1 }, { unique: true });
exports.AttendanceRecord = mongoose_1.default.model('AttendanceRecord', AttendanceRecordSchema);
const AttendanceCorrectionSchema = new mongoose_1.Schema({
    attendanceRecordId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AttendanceRecord', required: true, index: true },
    beneficiaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    originalStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    originalClockIn: { type: Date },
    newClockIn: { type: Date },
    originalClockOut: { type: Date },
    newClockOut: { type: Date },
    reason: { type: String, required: true },
    supportingEvidenceUrl: { type: String },
    correctedByStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff', required: true },
}, { timestamps: true });
exports.AttendanceCorrection = mongoose_1.default.model('AttendanceCorrection', AttendanceCorrectionSchema);
//# sourceMappingURL=attendance.model.js.map