import { CalendarEventType } from "../constants/enums.js";
export interface ISkillArea {
    _id: any;
    name: string;
    code: string;
    category: "Technical / Vocational" | "Digital & ICT" | "Creative Arts" | "Renewable Energy" | "Business & Entrepreneurship" | "Other";
    description: string;
    defaultDurationWeeks: number;
    certificationType: "National Certification" | "AEF Certificate of Competency" | "Partner Joint Certificate" | "Certificate of Participation";
    requiredFacilities?: string[];
    requiredEquipment?: string[];
    prerequisites?: string[];
    isActive: boolean;
}
export interface IProgram {
    _id: any;
    title: string;
    slug?: string;
    code: string;
    description: string;
    organizerType: "Adele Owned" | "Government Owned" | "NGO Partner" | "Private Sector" | "Joint Venture";
    organizerName: string;
    partnerIds: any[];
    deliveryRole: "Primary Host" | "Accredited Training Centre" | "Consortium Partner" | "Co-host" | "Accredited Facilitator" | "Partner Funded";
    status: "draft" | "active" | "enrolling" | "in_progress" | "completed" | "archived";
    skillAreaIds: any[];
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
    slotNumber: number;
    slotName: string;
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    skillAreaIds: any[];
    roomId?: any;
    notes?: string;
}
export interface ICohortSkillAreaConfig {
    skillAreaId: any;
    skillName?: string;
    trainerStaffIds: any[];
    assignedRoomId?: any;
    daysOfWeek: number[];
    startTime: string;
    endTime: string;
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
    status: "upcoming" | "enrolling" | "in_progress" | "assessments" | "completed" | "cancelled";
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
    sessionDate: Date;
    startTime: string;
    endTime: string;
    slotNumber?: number;
    isPublished?: boolean;
    topic?: string;
    sessionType: "Regular Practical" | "Theory Lecture" | "Workshop Lab" | "Assessment" | "Guest Lecture" | "Rescheduled";
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
    centreId?: any;
    programId?: any;
    cohortId?: any;
    affectsAttendance: boolean;
    replacementTrainingDate?: Date;
    createdBy: any;
}
