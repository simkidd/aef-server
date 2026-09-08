import mongoose, { Document, Schema } from "mongoose";
import { ISkillArea, IProgram } from "../interfaces/program.interface.js";

export interface ISkillAreaDocument extends Omit<ISkillArea, "_id">, Document {}
export interface IProgramDocument extends Omit<IProgram, "_id">, Document {}

const SkillAreaSchema = new Schema<ISkillAreaDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: [
        "Technical / Vocational",
        "Digital & ICT",
        "Creative Arts",
        "Renewable Energy",
        "Business & Entrepreneurship",
        "Agriculture",
        "Other",
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    defaultDurationWeeks: { type: Number, required: true, default: 8 },
    certificationType: {
      type: String,
      enum: [
        "National Certification",
        "AEF Certificate of Competency",
        "Partner Joint Certificate",
        "Certificate of Participation",
      ],
      default: "AEF Certificate of Competency",
    },
    requiredFacilities: [{ type: String }],
    requiredEquipment: [{ type: String }],
    prerequisites: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const SkillArea = mongoose.model<ISkillAreaDocument>(
  "SkillArea",
  SkillAreaSchema,
);

const ProgramSchema = new Schema<IProgramDocument>(
  {
    title: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, required: true },
    organizerType: {
      type: String,
      enum: [
        "Adele Owned",
        "Government Owned",
        "NGO Partner",
        "Private Sector",
        "Joint Venture",
      ],
      required: true,
      index: true,
    },
    organizerName: { type: String, required: true, trim: true },
    partnerIds: [{ type: Schema.Types.ObjectId, ref: "Partner" }],
    deliveryRole: {
      type: String,
      enum: [
        "Primary Host",
        "Accredited Training Centre",
        "Consortium Partner",
        "Co-host",
        "Accredited Facilitator",
        "Partner Funded",
      ],
      default: "Primary Host",
    },
    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "enrolling",
        "in_progress",
        "completed",
        "archived",
      ],
      lowercase: true,
      default: "draft",
      index: true,
    },
    skillAreaIds: [
      { type: Schema.Types.ObjectId, ref: "SkillArea", required: true },
    ],
    eligibilityCriteria: [{ type: String }],
    requirements: [{ type: String }],
    maxSlots: { type: Number, default: 100 },
    applicationStartDate: { type: Date },
    applicationDeadline: { type: Date },
    trainingStartDate: { type: Date },
    trainingEndDate: { type: Date },
    imageUrl: { type: String },
    bannerUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const Program = mongoose.model<IProgramDocument>(
  "Program",
  ProgramSchema,
);
