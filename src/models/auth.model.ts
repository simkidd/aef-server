import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAuth, IOtp } from '../interfaces/auth.interface.js';

export interface IAuthDocument extends Omit<IAuth, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AuthSchema = new Schema<IAuthDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastPasswordChangeAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
AuthSchema.pre<IAuthDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Password verification method
AuthSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const Auth = mongoose.model<IAuthDocument>('Auth', AuthSchema);

export interface IAuthSession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AuthSessionSchema = new Schema<IAuthSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true, index: { expires: '7d' } },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AuthSession = mongoose.model<IAuthSession>('AuthSession', AuthSessionSchema);

export interface IOtpDocument extends Omit<IOtp, '_id'>, Document {}

const OtpSchema = new Schema<IOtpDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['LOGIN', 'VERIFICATION', 'PASSWORD_RESET'],
      default: 'VERIFICATION',
    },
    expiresAt: { type: Date, required: true, index: { expires: '10m' } },
    isUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Otp = mongoose.model<IOtpDocument>('Otp', OtpSchema);
