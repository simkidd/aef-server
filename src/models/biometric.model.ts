import mongoose, { Document, Schema } from "mongoose";
import {
  IBiometricDevice,
  IBiometricIdentity,
  IBiometricEvent,
} from "../interfaces/biometric.interface.js";
import { BiometricScanType } from "../constants/enums.js";

export type IBiometricDeviceDocument = IBiometricDevice & Document;
export type IBiometricIdentityDocument = IBiometricIdentity & Document;
export type IBiometricEventDocument = IBiometricEvent & Document;

const BiometricDeviceSchema = new Schema<IBiometricDevice>(
  {
    deviceName: { type: String, required: true, trim: true },
    deviceSerial: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    locationDescription: { type: String, required: true },
    model: {
      type: String,
      required: true,
      default: "AEF-OptiScan 5000 Pro (Fingerprint)",
    },
    deviceType: {
      type: String,
      enum: ["Fingerprint"],
      default: "Fingerprint",
    },
    ipAddress: { type: String },
    status: {
      type: String,
      enum: ["Online", "Offline", "Syncing", "Maintenance"],
      default: "Online",
    },
    lastHeartbeat: { type: Date, default: Date.now },
    lastSyncAt: { type: Date, default: Date.now },
    registeredTemplatesCount: { type: Number, default: 0 },
    apiKey: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const BiometricDevice = mongoose.model<IBiometricDevice>(
  "BiometricDevice",
  BiometricDeviceSchema,
);

const BiometricIdentitySchema = new Schema<IBiometricIdentityDocument>(
  {
    beneficiaryId: {
      type: Schema.Types.ObjectId,
      ref: "BeneficiaryProfile",
      required: true,
      unique: true,
      index: true,
    },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    biometricToken: { type: String, required: true, unique: true, index: true },
    registeredDeviceId: {
      type: Schema.Types.ObjectId,
      ref: "BiometricDevice",
      required: true,
    },
    registeredByStaffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    registeredAt: { type: Date, default: Date.now },
    qualityScore: { type: Number, default: 98 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const BiometricIdentity = mongoose.model<IBiometricIdentityDocument>(
  "BiometricIdentity",
  BiometricIdentitySchema,
);

const BiometricEventSchema = new Schema<IBiometricEventDocument>(
  {
    deviceSerial: { type: String, required: true, index: true },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    biometricToken: { type: String, required: true, index: true },
    scanType: {
      type: String,
      enum: Object.values(BiometricScanType),
      required: true,
      default: BiometricScanType.IN,
    },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    isMatched: { type: Boolean, default: false, index: true },
    beneficiaryId: {
      type: Schema.Types.ObjectId,
      ref: "BeneficiaryProfile",
      index: true,
    },
    isProcessed: { type: Boolean, default: false, index: true },
    processingError: { type: String },
    rawPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const BiometricEvent = mongoose.model<IBiometricEventDocument>(
  "BiometricEvent",
  BiometricEventSchema,
);
