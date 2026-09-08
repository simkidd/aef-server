import mongoose, { Document, Schema } from "mongoose";
import { IApplication } from "../interfaces/beneficiary.interface.js";
import { ApplicationStatus } from "../constants/enums.js";

export interface IApplicationDocument
  extends Omit<IApplication, "_id">, Document {}

const ApplicationStatusHistorySchema = new Schema({
  status: { type: String, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  changedAt: { type: Date, default: Date.now },
  reason: { type: String },
});

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    beneficiaryId: {
      type: Schema.Types.ObjectId,
      ref: "BeneficiaryProfile",
      required: true,
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    preferredSkillAreaId: {
      type: Schema.Types.ObjectId,
      ref: "SkillArea",
      required: true,
      index: true,
    },
    preferredCentreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.SUBMITTED,
      index: true,
    },
    statusReason: { type: String },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    reviewedAt: { type: Date },
    statementOfPurpose: { type: String },
    previousExperience: { type: String },
    submittedAt: { type: Date, default: Date.now },
    statusHistory: [ApplicationStatusHistorySchema],
  },
  { timestamps: true },
);

export const Application = mongoose.model<IApplicationDocument>(
  "Application",
  ApplicationSchema,
);
