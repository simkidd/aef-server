import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces/auth.interface.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const ScopeAssignmentSchema = new Schema({
  scopeType: {
    type: String,
    enum: ['GLOBAL', 'CENTRE', 'PROGRAM', 'DEPARTMENT'],
    required: true,
  },
  targetId: { type: Schema.Types.ObjectId, refPath: 'scopeModel' },
  targetName: { type: String },
});

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isStaff: { type: Boolean, default: false },
    isBeneficiary: { type: Boolean, default: false },
    staffRecordId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    beneficiaryProfileId: { type: Schema.Types.ObjectId, ref: 'BeneficiaryProfile' },
    roles: [{ type: String, required: true, index: true }], // Role codes e.g. 'SUPER_ADMIN', 'CENTRE_MANAGER', 'BENEFICIARY'
    customPermissions: [{ type: String }],
    scopeAssignments: [ScopeAssignmentSchema],
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUserDocument>('User', UserSchema);
