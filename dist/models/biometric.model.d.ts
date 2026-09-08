import mongoose, { Document } from "mongoose";
import { IBiometricDevice, IBiometricIdentity, IBiometricEvent } from "../interfaces/biometric.interface.js";
export type IBiometricDeviceDocument = IBiometricDevice & Document;
export type IBiometricIdentityDocument = IBiometricIdentity & Document;
export type IBiometricEventDocument = IBiometricEvent & Document;
export declare const BiometricDevice: mongoose.Model<IBiometricDevice, {}, {}, {}, mongoose.Document<unknown, {}, IBiometricDevice, {}, {}> & IBiometricDevice & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export declare const BiometricIdentity: mongoose.Model<IBiometricIdentityDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBiometricIdentityDocument, {}, {}> & IBiometricIdentity & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
export declare const BiometricEvent: mongoose.Model<IBiometricEventDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBiometricEventDocument, {}, {}> & IBiometricEvent & mongoose.Document<mongoose.Types.ObjectId, any, any, Record<string, any>, {}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
