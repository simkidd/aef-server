import mongoose, { Document } from 'mongoose';
import { IAuth, IOtp } from '../interfaces/auth.interface.js';
export interface IAuthDocument extends Omit<IAuth, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const Auth: mongoose.Model<IAuthDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAuthDocument, {}, {}> & IAuthDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
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
export declare const AuthSession: mongoose.Model<IAuthSession, {}, {}, {}, mongoose.Document<unknown, {}, IAuthSession, {}, {}> & IAuthSession & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export interface IOtpDocument extends Omit<IOtp, '_id'>, Document {
}
export declare const Otp: mongoose.Model<IOtpDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOtpDocument, {}, {}> & IOtpDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
