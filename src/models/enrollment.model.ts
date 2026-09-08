import mongoose, { Document, Schema } from 'mongoose';
import { IEnrollment } from '../interfaces/beneficiary.interface.js';
import { EnrollmentStatus } from '../constants/enums.js';

export interface IEnrollmentDocument extends Omit<IEnrollment, '_id'>, Document {}

const EnrollmentStatusHistorySchema = new Schema({
  status: { type: String, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String },
});

const EnrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    enrollmentCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    beneficiaryId: { type: Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(EnrollmentStatus),
      default: EnrollmentStatus.SELECTED,
      index: true,
    },
    statusReason: { type: String },
    verificationDetails: {
      verifiedByStaffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
      verifiedAt: { type: Date },
      documentsChecked: { type: Boolean, default: false },
      identityVerified: { type: Boolean, default: false },
      physicalNotes: { type: String },
    },
    biometricRegistrationDetails: {
      registeredByStaffId: { type: Schema.Types.ObjectId, ref: 'Staff' },
      registeredAt: { type: Date },
      deviceId: { type: Schema.Types.ObjectId, ref: 'BiometricDevice' },
      biometricIdentifier: { type: String },
    },
    enrollmentDate: { type: Date },
    completionDate: { type: Date },
    droppedDate: { type: Date },
    dropReason: { type: String },
    replacedByEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
    overallAttendanceRate: { type: Number, default: 0 },
    assessmentPassed: { type: Boolean },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: Schema.Types.ObjectId, ref: 'Certificate' },
    statusHistory: [EnrollmentStatusHistorySchema],
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);
