import mongoose, { Document, Schema } from 'mongoose';
import { IStaff, IVolunteer, IPartner } from '../interfaces/org.interface.js';

export interface IStaffDocument extends Omit<IStaff, '_id'>, Document {}
export interface IVolunteerDocument extends Omit<IVolunteer, '_id'>, Document {}
export interface IPartnerDocument extends Omit<IPartner, '_id'>, Document {}

const StaffSchema = new Schema<IStaffDocument>(
  {
    staffCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], lowercase: true, required: true },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String },
    state: { type: String },
    lga: { type: String },
    position: { type: String, required: true, trim: true },
    employmentStatus: {
      type: String,
      enum: ['active', 'on leave', 'suspended', 'terminated', 'resigned'],
      lowercase: true,
      default: 'active',
      index: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'volunteer'],
      lowercase: true,
      default: 'full-time',
    },
    assignedCentreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre', index: true },
    managerId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    dateJoined: { type: Date, required: true, default: Date.now },
    dateExited: { type: Date },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
    hasSystemAccount: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    salaryInfo: {
      accountNumber: { type: String },
      bankName: { type: String },
      baseSalary: { type: Number },
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        type: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaffDocument>('Staff', StaffSchema);

const VolunteerSchema = new Schema<IVolunteerDocument>(
  {
    volunteerCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, lowercase: true, required: true },
    skills: [{ type: String }],
    assignedCentreId: { type: Schema.Types.ObjectId, ref: 'TrainingCentre' },
    responsibilities: { type: String },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'completed'], lowercase: true, default: 'active', index: true },
    hasSystemAccount: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Volunteer = mongoose.model<IVolunteerDocument>('Volunteer', VolunteerSchema);

const PartnerSchema = new Schema<IPartnerDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['government', 'ngo', 'corporate', 'sponsor', 'training organization', 'funding agency', 'employer', 'other'],
      lowercase: true,
      required: true,
      index: true,
    },
    contactPerson: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    website: { type: String },
    address: { type: String },
    state: { type: String },
    country: { type: String, default: 'Nigeria' },
    status: { type: String, enum: ['active', 'prospective', 'inactive', 'archived'], lowercase: true, default: 'active', index: true },
    programsSponsored: [{ type: Schema.Types.ObjectId, ref: 'Program' }],
    notes: { type: String },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Partner = mongoose.model<IPartnerDocument>('Partner', PartnerSchema);

