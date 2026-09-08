import mongoose, { Document, Schema } from 'mongoose';
import { ICertificate } from '../interfaces/certificate.interface.js';

export interface ICertificateDocument extends Omit<ICertificate, '_id'>, Document {}

const CertificateSchema = new Schema<ICertificateDocument>(
  {
    certificateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    verificationCode: { type: String, required: true, unique: true, index: true },
    beneficiaryId: { type: Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, unique: true, index: true },
    programId: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    issueDate: { type: Date, required: true, default: Date.now },
    overallAttendanceRate: { type: Number, required: true },
    overallAssessmentScore: { type: Number },
    grade: { type: String, default: 'Pass' },
    authorizedSignatory: {
      name: { type: String, required: true, default: 'Hon. Adele Executive Director' },
      title: { type: String, required: true, default: 'Executive Director, AEF' },
      signatureUrl: { type: String },
    },
    issuingOrganization: { type: String, required: true, default: 'Adele Empowerment Foundation' },
    qrCodeUrl: { type: String },
    status: {
      type: String,
      enum: ['Issued', 'Revoked', 'Suspended'],
      default: 'Issued',
      index: true,
    },
    revocationReason: { type: String },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificateDocument>('Certificate', CertificateSchema);
