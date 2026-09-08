import { AttendanceStatus } from '../constants/enums.js';
export interface IAttendancePolicy {
    _id: any;
    name: string;
    scopeType: 'GLOBAL' | 'PROGRAM' | 'COHORT';
    targetId?: any;
    defaultStartTime: string;
    defaultEndTime: string;
    gracePeriodMinutes: number;
    lateThresholdMinutes: number;
    minDailyDurationMinutes: number;
    requireClockOut: boolean;
    allowMultipleClockIns: boolean;
    minAttendancePercentForCertificate: number;
    lowAttendanceAlertThreshold: number;
    criticalAttendanceAlertThreshold: number;
    isDefault: boolean;
}
export interface IAttendanceRecord {
    _id: any;
    beneficiaryId: any;
    enrollmentId: any;
    cohortId: any;
    skillAreaId: any;
    centreId: any;
    sessionId?: any;
    date: Date;
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
