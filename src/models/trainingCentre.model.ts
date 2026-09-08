import mongoose, { Document, Schema } from "mongoose";
import {
  ITrainingCentre,
  IRoomFacility,
  IAsset,
  IDocumentRecord,
} from "../interfaces/org.interface.js";

export interface ITrainingCentreDocument
  extends Omit<ITrainingCentre, "_id">, Document {}
export interface IRoomFacilityDocument
  extends Omit<IRoomFacility, "_id">, Document {}
export interface IAssetDocument extends Omit<IAsset, "_id">, Document {}
export interface IDocumentRecordDocument
  extends Omit<IDocumentRecord, "_id">, Document {}

const TrainingCentreSchema = new Schema<ITrainingCentreDocument>(
  {
    name: { type: String, required: true, trim: true },
    centreCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    address: { type: String, required: true },
    state: { type: String, required: true, index: true },
    lga: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true },
    centreManagerId: { type: Schema.Types.ObjectId, ref: "Staff" },
    capacity: { type: Number, required: true, default: 100 },
    status: {
      type: String,
      enum: ["active", "under maintenance", "closed", "planned"],
      lowercase: true,
      default: "active",
      index: true,
    },
    accreditationDetails: {
      accreditedBy: { type: String },
      accreditationNumber: { type: String },
      validUntil: { type: Date },
    },
    geoCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    notes: { type: String },
  },
  { timestamps: true },
);

export const TrainingCentre = mongoose.model<ITrainingCentreDocument>(
  "TrainingCentre",
  TrainingCentreSchema,
);

const RoomFacilitySchema = new Schema<IRoomFacilityDocument>(
  {
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String },
    type: {
      type: String,
      enum: [
        "classroom",
        "workshop",
        "computer lab",
        "practical bay",
        "conference room",
        "other",
      ],
      lowercase: true,
      required: true,
      index: true,
    },
    capacity: { type: Number, required: true, default: 30 },
    equipment: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["operational", "maintenance", "decommissioned"],
      lowercase: true,
      default: "operational",
      index: true,
    },
    notes: { type: String },
  },
  { timestamps: true },
);

export const RoomFacility = mongoose.model<IRoomFacilityDocument>(
  "RoomFacility",
  RoomFacilitySchema,
);

const AssetSchema = new Schema<IAssetDocument>(
  {
    assetTag: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "it equipment",
        "solar hardware",
        "welding & machinery",
        "plumbing tools",
        "vehicle",
        "furniture",
        "biometric scanner",
        "other",
      ],
      lowercase: true,
      required: true,
      index: true,
    },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      index: true,
    },
    roomId: { type: Schema.Types.ObjectId, ref: "RoomFacility" },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: "Staff" },
    condition: {
      type: String,
      enum: [
        "excellent",
        "good",
        "fair",
        "needs repair",
        "damaged",
        "disposed",
      ],
      lowercase: true,
      default: "good",
    },
    status: {
      type: String,
      enum: ["in use", "in storage", "under repair", "retired"],
      lowercase: true,
      default: "in use",
      index: true,
    },
    purchaseDate: { type: Date },
    purchaseCost: { type: Number },
    serialNumber: { type: String },
    supplier: { type: String },
    maintenanceHistory: [
      {
        date: { type: Date, default: Date.now },
        description: { type: String, required: true },
        cost: { type: Number },
        performedBy: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const Asset = mongoose.model<IAssetDocument>("Asset", AssetSchema);

const DocumentRecordSchema = new Schema<IDocumentRecordDocument>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "accreditation",
        "policy",
        "partner agreement",
        "staff document",
        "centre document",
        "program curriculum",
        "general",
      ],
      lowercase: true,
      required: true,
      index: true,
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    isPublic: { type: Boolean, default: false },
    requiredPermission: { type: String },
    relatedCentreId: { type: Schema.Types.ObjectId, ref: "TrainingCentre" },
    relatedProgramId: { type: Schema.Types.ObjectId, ref: "Program" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const DocumentRecord = mongoose.model<IDocumentRecordDocument>(
  "DocumentRecord",
  DocumentRecordSchema,
);
