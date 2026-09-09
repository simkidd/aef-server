import mongoose, { Document, Schema } from 'mongoose';
import { IBeneficiaryProfile } from '../interfaces/beneficiary.interface.js';

export interface IBeneficiaryProfileDocument extends Omit<IBeneficiaryProfile, '_id'>, Document {}

const BeneficiaryProfileSchema = new Schema<IBeneficiaryProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    beneficiaryCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String },
    stateOfOrigin: { type: String },
    lgaOfOrigin: { type: String },
    stateOfResidence: { type: String },
    lgaOfResidence: { type: String },
    highestEducation: {
      type: String,
      enum: ['None', 'Primary', 'Secondary (SSCE/WAEC)', 'OND/NCE', 'HND/BSc', 'Postgraduate', 'Vocational Certificate'],
    },
    employmentStatus: {
      type: String,
      enum: ['Unemployed', 'Self-Employed', 'Student', 'Employed Part-Time', 'Employed Full-Time'],
    },
    disabilityStatus: {
      type: String,
      enum: ['None', 'Visual', 'Hearing', 'Mobility', 'Other'],
      default: 'None',
    },
    identificationType: {
      type: String,
      enum: ['National NIN', "Voter's Card", "Driver's License", 'International Passport', 'Birth Certificate'],
    },
    identificationNumber: { type: String },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    profilePhotoUrl: { type: String },
    documents: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    biometricRegistered: { type: Boolean, default: false },
    biometricIdentifier: { type: String, index: true },
    activeEnrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment' },
  },
  { timestamps: true }
);

export const BeneficiaryProfile = mongoose.model<IBeneficiaryProfileDocument>('BeneficiaryProfile', BeneficiaryProfileSchema);
