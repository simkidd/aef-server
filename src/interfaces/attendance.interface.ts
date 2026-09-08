import { AttendanceStatus } from '../constants/enums.js';

export interface IAttendancePolicy {
  _id: any;
  name: string;
  scopeType: 'GLOBAL' | 'PROGRAM' | 'COHORT';
  targetId?: any; // programId or cohortId
  defaultStartTime: string; // "09:00"
  defaultEndTime: string; // "12:00"
  gracePeriodMinutes: number; // e.g. 15 mins (up to 09:15 is on-time)
  lateThresholdMinutes: number; // e.g. 45 mins (after 09:45 is marked Absent unless Excused)
  minDailyDurationMinutes: number; // e.g. 120 mins
  requireClockOut: boolean;
  allowMultipleClockIns: boolean;
  minAttendancePercentForCertificate: number; // e.g. 80%
  lowAttendanceAlertThreshold: number; // e.g. 75%
  criticalAttendanceAlertThreshold: number; // e.g. 60%
  isDefault: boolean;
}

export interface IAttendanceRecord {
  _id: any;
  beneficiaryId: any;
  enrollmentId: any;
  cohortId: any;
  skillAreaId: any;
  centreId: any;
  sessionId?: any; // If mapped to specific scheduled session
  date: Date; // Date of training
  status: AttendanceStatus;
  firstClockIn?: Date;
  lastClockOut?: Date;
  clockInEvents: {
    timestamp: Date;
    deviceId: any;
    scanType: 'IN' | 'OUT';
  }[];
  durationMinutes: number;
  isLate: boolean;
  minutesLate: number;
  isExcused: boolean;
  excuseReason?: string;
  excuseApprovedBy?: any;
  isManualCorrection: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendanceCorrection {
  _id: any;
  attendanceRecordId: any;
  beneficiaryId: any;
  cohortId: any;
  originalStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  originalClockIn?: Date;
  newClockIn?: Date;
  originalClockOut?: Date;
  newClockOut?: Date;
  reason: string;
  supportingEvidenceUrl?: string;
  correctedByStaffId: any;
  createdAt: Date;
}
