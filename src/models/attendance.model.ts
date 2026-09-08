import mongoose, { Document, Schema } from 'mongoose';
import { IAttendancePolicy, IAttendanceRecord, IAttendanceCorrection } from '../interfaces/attendance.interface.js';
import { AttendanceStatus } from '../constants/enums.js';

export interface IAttendancePolicyDocument extends Omit<IAttendancePolicy, '_id'>, Document {}
export interface IAttendanceRecordDocument extends Omit<IAttendanceRecord, '_id'>, Document {}
export interface IAttendanceCorrectionDocument extends Omit<IAttendanceCorrection, '_id'>, Document {}

const AttendancePolicySchema = new Schema<IAttendancePolicyDocument>(
  {
    name: { type: String, required: true, trim: true },
    scopeType: {
      type: String,
      enum: ['GLOBAL', 'PROGRAM', 'COHORT'],
      default: 'GLOBAL',
      index: true,
    },
    targetId: { type: Schema.Types.ObjectId },
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
  },
  { timestamps: true }
);

export const AttendancePolicy = mongoose.model<IAttendancePolicyDocument>('AttendancePolicy', AttendancePolicySchema);

const ClockInEventSchema = new Schema({
  timestamp: { type: Date, required: true },
  deviceId: { type: String, required: true },
  scanType: { type: String, enum: ['IN', 'OUT'], required: true },
});

const AttendanceRecordSchema = new Schema<IAttendanceRecordDocument>(
  {
    beneficiaryId: { type: Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    sessionId: { type: Schema.Types.ObjectId, ref: 'TrainingSession', index: true },
    date: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.ABSENT,
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
    excuseApprovedBy: { type: Schema.Types.ObjectId, ref: 'Staff' },
    isManualCorrection: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index to guarantee one attendance record per beneficiary per session/date
AttendanceRecordSchema.index({ beneficiaryId: 1, date: 1, cohortId: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model<IAttendanceRecordDocument>('AttendanceRecord', AttendanceRecordSchema);

const AttendanceCorrectionSchema = new Schema<IAttendanceCorrectionDocument>(
  {
    attendanceRecordId: { type: Schema.Types.ObjectId, ref: 'AttendanceRecord', required: true, index: true },
    beneficiaryId: { type: Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true },
    cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true },
    originalStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    originalClockIn: { type: Date },
    newClockIn: { type: Date },
    originalClockOut: { type: Date },
    newClockOut: { type: Date },
    reason: { type: String, required: true },
    supportingEvidenceUrl: { type: String },
    correctedByStaffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  },
  { timestamps: true }
);

export const AttendanceCorrection = mongoose.model<IAttendanceCorrectionDocument>('AttendanceCorrection', AttendanceCorrectionSchema);
