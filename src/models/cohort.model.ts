import mongoose, { Document, Schema } from "mongoose";
import {
  ICohort,
  ITrainingSession,
  ITrainingCalendarEvent,
} from "../interfaces/program.interface.js";

export interface ICohortDocument extends Omit<ICohort, "_id">, Document {}
export interface ITrainingSessionDocument
  extends Omit<ITrainingSession, "_id">, Document {}
export interface ITrainingCalendarEventDocument
  extends Omit<ITrainingCalendarEvent, "_id">, Document {}

const CohortSkillAreaConfigSchema = new Schema({
  skillAreaId: {
    type: Schema.Types.ObjectId,
    ref: "SkillArea",
    required: true,
  },
  skillName: { type: String },
  trainerStaffIds: [{ type: Schema.Types.ObjectId, ref: "Staff" }],
  assignedRoomId: { type: Schema.Types.ObjectId, ref: "RoomFacility" },
  daysOfWeek: [{ type: Number, required: true }], // 0=Sun, 1=Mon...
  startTime: { type: String, required: true, default: "09:00" },
  endTime: { type: String, required: true, default: "12:00" },
  durationWeeks: { type: Number, required: true, default: 8 },
  maxCapacity: { type: Number, required: true, default: 25 },
});

const TimetableSlotSchema = new Schema({
  slotNumber: { type: Number, required: true }, // 1, 2, 3
  slotName: { type: String, required: true }, // "Morning Session", etc.
  startTime: { type: String, required: true, default: "08:30" },
  endTime: { type: String, required: true, default: "11:30" },
  daysOfWeek: [{ type: Number, required: true }], // 0=Sun, 1=Mon...
  skillAreaIds: [{ type: Schema.Types.ObjectId, ref: "SkillArea" }],
  roomId: { type: Schema.Types.ObjectId, ref: "RoomFacility" },
  notes: { type: String },
});

const CohortSchema = new Schema<ICohortDocument>(
  {
    name: { type: String, required: true, trim: true },
    cohortCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "upcoming",
        "enrolling",
        "in_progress",
        "assessments",
        "completed",
        "cancelled",
      ],
      lowercase: true,
      default: "upcoming",
      index: true,
    },
    maxCapacity: { type: Number, required: true, default: 30 },
    skillConfigs: [CohortSkillAreaConfigSchema],
    timetableStatus: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    timetablePublishedAt: { type: Date },
    timetableSlots: [TimetableSlotSchema],
    notes: { type: String },
  },
  { timestamps: true },
);

export const Cohort = mongoose.model<ICohortDocument>("Cohort", CohortSchema);

const TrainingSessionSchema = new Schema<ITrainingSessionDocument>(
  {
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
      index: true,
    },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      required: true,
      index: true,
    },
    skillAreaId: {
      type: Schema.Types.ObjectId,
      ref: "SkillArea",
      required: true,
      index: true,
    },
    trainerStaffId: { type: Schema.Types.ObjectId, ref: "Staff", index: true },
    roomId: { type: Schema.Types.ObjectId, ref: "RoomFacility" },
    sessionDate: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotNumber: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: false, index: true },
    topic: { type: String },
    sessionType: {
      type: String,
      enum: [
        "Regular Practical",
        "Theory Lecture",
        "Workshop Lab",
        "Assessment",
        "Guest Lecture",
        "Rescheduled",
      ],
      default: "Regular Practical",
    },
    isCancelled: { type: Boolean, default: false },
    cancellationReason: { type: String },
    rescheduledToSessionId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingSession",
    },
    attendanceProcessed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TrainingSession = mongoose.model<ITrainingSessionDocument>(
  "TrainingSession",
  TrainingSessionSchema,
);

const TrainingCalendarEventSchema = new Schema<ITrainingCalendarEventDocument>(
  {
    title: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: [
        "Public Holiday",
        "Centre Closed",
        "Trainer Unavailable",
        "Emergency Closure",
        "Weather-related cancellation",
        "Program Break",
        "Examination Day",
        "Assessment Day",
        "Rescheduled Training",
        "Other",
      ],
      required: true,
      index: true,
    },
    description: { type: String },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    centreId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCentre",
      index: true,
    },
    programId: { type: Schema.Types.ObjectId, ref: "Program", index: true },
    cohortId: { type: Schema.Types.ObjectId, ref: "Cohort", index: true },
    affectsAttendance: { type: Boolean, default: true },
    replacementTrainingDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const TrainingCalendarEvent =
  mongoose.model<ITrainingCalendarEventDocument>(
    "TrainingCalendarEvent",
    TrainingCalendarEventSchema,
  );
