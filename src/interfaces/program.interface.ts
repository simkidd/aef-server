import { CalendarEventType } from "../constants/enums.js";

export interface ISkillArea {
  _id: any;
  name: string;
  code: string;
  category:
    | "Technical / Vocational"
    | "Digital & ICT"
    | "Creative Arts"
    | "Renewable Energy"
    | "Business & Entrepreneurship"
    | "Other";
  description: string;
  defaultDurationWeeks: number;
  certificationType:
    | "National Certification"
    | "AEF Certificate of Competency"
    | "Partner Joint Certificate"
    | "Certificate of Participation";
  requiredFacilities?: string[];
  requiredEquipment?: string[];
  prerequisites?: string[];
  isActive: boolean;
}

export interface IProgram {
  _id: any;
  title: string;
  code: string;
  description: string;
  organizerType:
    | "Adele Owned"
    | "Government Owned"
    | "NGO Partner"
    | "Private Sector"
    | "Joint Venture";
  organizerName: string;
  partnerIds: any[]; // Partner IDs
  deliveryRole:
    | "Primary Host"
    | "Accredited Training Centre"
    | "Consortium Partner"
    | "Co-host"
    | "Accredited Facilitator"
    | "Partner Funded";
  status:
    | "draft"
    | "active"
    | "enrolling"
    | "in_progress"
    | "completed"
    | "archived";
  skillAreaIds: any[]; // SkillArea IDs
  eligibilityCriteria?: string[];
  requirements?: string[];
  maxSlots?: number;
  applicationStartDate?: Date;
  applicationDeadline?: Date;
  trainingStartDate?: Date;
  trainingEndDate?: Date;
  imageUrl?: string;
  bannerUrl?: string;
  isFeatured: boolean;
  published: boolean;
  notes?: string;
}

export interface ITimetableSlot {
  slotNumber: number; // 1, 2, 3
  slotName: string; // e.g. "Morning Session", "Afternoon Session", "Evening Session"
  startTime: string; // "08:30"
  endTime: string; // "11:30"
  daysOfWeek: number[]; // [1, 2, 3, 4, 5]
  skillAreaIds: any[]; // SkillArea IDs
  roomId?: any; // Default RoomFacility ID
  notes?: string;
}

export interface ICohortSkillAreaConfig {
  skillAreaId: any;
  skillName?: string;
  trainerStaffIds: any[]; // Staff IDs
  assignedRoomId?: any; // RoomFacility ID
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  startTime: string; // "09:00"
  endTime: string; // "12:00"
  durationWeeks: number;
  maxCapacity: number;
}

export interface ICohort {
  _id: any;
  name: string;
  cohortCode: string;
  programId: any;
  centreId: any;
  startDate: Date;
  endDate: Date;
  status:
    | "upcoming"
    | "enrolling"
    | "in_progress"
    | "assessments"
    | "completed"
    | "cancelled";
  maxCapacity: number;
  skillConfigs: ICohortSkillAreaConfig[];
  timetableStatus?: "draft" | "published";
  timetablePublishedAt?: Date;
  timetableSlots?: ITimetableSlot[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrainingSession {
  _id: any;
  cohortId: any;
  programId: any;
  centreId: any;
  skillAreaId: any;
  trainerStaffId?: any;
  roomId?: any;
  sessionDate: Date; // Date of the session
  startTime: string; // "09:00"
  endTime: string; // "12:00"
  slotNumber?: number; // 1, 2, 3
  isPublished?: boolean;
  topic?: string;
  sessionType:
    | "Regular Practical"
    | "Theory Lecture"
    | "Workshop Lab"
    | "Assessment"
    | "Guest Lecture"
    | "Rescheduled";
  isCancelled: boolean;
  cancellationReason?: string;
  rescheduledToSessionId?: any;
  attendanceProcessed: boolean;
}

export interface ITrainingCalendarEvent {
  _id: any;
  title: string;
  eventType: CalendarEventType;
  description?: string;
  startDate: Date;
  endDate: Date;
  centreId?: any; // If undefined, applies globally
  programId?: any; // If undefined, applies to all programs in that centre
  cohortId?: any;
  affectsAttendance: boolean; // non-training days do not penalize attendance
  replacementTrainingDate?: Date;
  createdBy: any;
}
