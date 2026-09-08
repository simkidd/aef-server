import mongoose, { Document, Schema } from 'mongoose';
import { IRole, IPermission } from '../interfaces/auth.interface.js';

export interface IRoleDocument extends Omit<IRole, '_id'>, Document {}
export interface IPermissionDocument extends Omit<IPermission, '_id'>, Document {}

const PermissionSchema = new Schema<IPermissionDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: false, trim: true, index: true },
    name: { type: String, required: true },
    module: { type: String, required: true, index: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Permission = mongoose.model<IPermissionDocument>('Permission', PermissionSchema);

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String },
    defaultScope: {
      type: String,
      enum: ['GLOBAL', 'CENTRE', 'PROGRAM', 'DEPARTMENT'],
      default: 'GLOBAL',
    },
    permissions: [{ type: String }], // Array of permission codes e.g. 'staff:view', 'attendance:edit'
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRoleDocument>('Role', RoleSchema);
