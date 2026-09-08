import { BiometricScanType } from '../../constants/enums.js';
export interface ProcessScanParams {
    beneficiaryId: string;
    centreId: string;
    deviceId: string;
    scanType: BiometricScanType;
    timestamp: Date;
}
export declare class AttendanceEngine {
    /**
     * Process a single biometric scan event against active enrollment & timetable
     */
    static processBiometricScan(params: ProcessScanParams): Promise<(import("mongoose").Document<unknown, {}, import("../../models/attendance.model.js").IAttendanceRecordDocument, {}, {}> & import("../../models/attendance.model.js").IAttendanceRecordDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Calculate cumulative attendance rate for an enrollment
     */
    static recalculateEnrollmentAttendance(enrollmentId: string): Promise<number>;
}
