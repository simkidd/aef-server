"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceEngine = void 0;
const enrollment_model_js_1 = require("../../models/enrollment.model.js");
const cohort_model_js_1 = require("../../models/cohort.model.js");
const attendance_model_js_1 = require("../../models/attendance.model.js");
const enums_js_1 = require("../../constants/enums.js");
class AttendanceEngine {
    /**
     * Process a single biometric scan event against active enrollment & timetable
     */
    static async processBiometricScan(params) {
        const { beneficiaryId, centreId, deviceId, scanType, timestamp } = params;
        // 1. Find active enrollment
        const enrollment = await enrollment_model_js_1.Enrollment.findOne({
            beneficiaryId,
            status: enums_js_1.EnrollmentStatus.ACTIVE,
        }).populate('cohortId');
        if (!enrollment) {
            console.warn(`[AttendanceEngine] No active enrollment found for beneficiary ${beneficiaryId}`);
            return null;
        }
        const cohortId = enrollment.cohortId?._id
            ? enrollment.cohortId._id.toString()
            : enrollment.cohortId.toString();
        const skillAreaId = enrollment.skillAreaId.toString();
        // 2. Fetch active policy (Cohort > Program > Global default)
        let policy = await attendance_model_js_1.AttendancePolicy.findOne({ scopeType: 'COHORT', targetId: cohortId });
        if (!policy) {
            policy = await attendance_model_js_1.AttendancePolicy.findOne({ scopeType: 'PROGRAM', targetId: enrollment.programId.toString() });
        }
        if (!policy) {
            policy = await attendance_model_js_1.AttendancePolicy.findOne({ isDefault: true });
        }
        if (!policy) {
            // Fallback defaults
            policy = {
                defaultStartTime: '09:00',
                defaultEndTime: '12:00',
                gracePeriodMinutes: 15,
                lateThresholdMinutes: 45,
                minDailyDurationMinutes: 120,
                requireClockOut: true,
                allowMultipleClockIns: true,
            };
        }
        // 3. Normalize scan date to Midnight UTC / local day start
        const scanDate = new Date(timestamp);
        const dayStart = new Date(scanDate.getFullYear(), scanDate.getMonth(), scanDate.getDate());
        // 4. Check for calendar exceptions (e.g. Holiday, Centre Closed)
        const calendarEvent = await cohort_model_js_1.TrainingCalendarEvent.findOne({
            startDate: { $lte: dayStart },
            endDate: { $gte: dayStart },
            $or: [
                { centreId: { $exists: false } },
                { centreId: null },
                { centreId },
            ],
            affectsAttendance: true,
        });
        if (calendarEvent && calendarEvent.eventType !== 'Rescheduled Training') {
            console.log(`[AttendanceEngine] Date ${dayStart.toDateString()} is non-training day: ${calendarEvent.title}`);
            // Scans on holidays/closed days are logged but not penalized
        }
        // 5. Look for scheduled TrainingSession for this cohort & skill today
        const session = await cohort_model_js_1.TrainingSession.findOne({
            cohortId,
            skillAreaId,
            sessionDate: dayStart,
            isCancelled: false,
        });
        // 6. Find or create today's AttendanceRecord
        let record = await attendance_model_js_1.AttendanceRecord.findOne({
            beneficiaryId,
            date: dayStart,
            cohortId,
        });
        const isFirstScan = !record;
        if (!record) {
            record = new attendance_model_js_1.AttendanceRecord({
                beneficiaryId,
                enrollmentId: enrollment._id,
                cohortId,
                skillAreaId,
                centreId,
                sessionId: session?._id,
                date: dayStart,
                status: enums_js_1.AttendanceStatus.PRESENT,
                clockInEvents: [],
                durationMinutes: 0,
                isLate: false,
                minutesLate: 0,
                isExcused: false,
                isManualCorrection: false,
            });
        }
        // Append clock in event
        record.clockInEvents.push({
            timestamp,
            deviceId,
            scanType,
        });
        // Determine session start time
        const [startHourStr, startMinStr] = (session?.startTime || policy.defaultStartTime || '09:00').split(':');
        const expectedStartTime = new Date(dayStart);
        expectedStartTime.setHours(parseInt(startHourStr, 10), parseInt(startMinStr, 10), 0, 0);
        // Calculate firstClockIn and lastClockOut
        if (scanType === enums_js_1.BiometricScanType.IN) {
            if (!record.firstClockIn || timestamp < record.firstClockIn) {
                record.firstClockIn = timestamp;
            }
        }
        else if (scanType === enums_js_1.BiometricScanType.OUT) {
            if (!record.lastClockOut || timestamp > record.lastClockOut) {
                record.lastClockOut = timestamp;
            }
        }
        // Evaluate lateness on first clock in
        if (record.firstClockIn) {
            const diffMs = record.firstClockIn.getTime() - expectedStartTime.getTime();
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            if (diffMinutes > policy.gracePeriodMinutes) {
                record.isLate = true;
                record.minutesLate = diffMinutes;
                if (diffMinutes > policy.lateThresholdMinutes) {
                    record.status = enums_js_1.AttendanceStatus.LATE;
                }
                else {
                    record.status = enums_js_1.AttendanceStatus.LATE;
                }
            }
            else {
                record.isLate = false;
                record.minutesLate = 0;
                record.status = enums_js_1.AttendanceStatus.PRESENT;
            }
        }
        // Calculate total duration in minutes if both clock in and clock out exist
        if (record.firstClockIn && record.lastClockOut) {
            const durationMs = record.lastClockOut.getTime() - record.firstClockIn.getTime();
            record.durationMinutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));
            if (policy.minDailyDurationMinutes && record.durationMinutes < policy.minDailyDurationMinutes) {
                if (record.status !== enums_js_1.AttendanceStatus.LATE) {
                    record.status = enums_js_1.AttendanceStatus.PARTIAL;
                }
            }
        }
        await record.save();
        // 7. Recalculate enrollment cumulative attendance rate
        await AttendanceEngine.recalculateEnrollmentAttendance(enrollment._id.toString());
        return record;
    }
    /**
     * Calculate cumulative attendance rate for an enrollment
     */
    static async recalculateEnrollmentAttendance(enrollmentId) {
        const enrollment = await enrollment_model_js_1.Enrollment.findById(enrollmentId);
        if (!enrollment)
            return 0;
        const records = await attendance_model_js_1.AttendanceRecord.find({ enrollmentId });
        if (records.length === 0)
            return 0;
        const attendedCount = records.filter((r) => r.status === enums_js_1.AttendanceStatus.PRESENT || r.status === enums_js_1.AttendanceStatus.LATE || r.status === enums_js_1.AttendanceStatus.EXCUSED).length;
        const rate = Math.round((attendedCount / records.length) * 100 * 10) / 10;
        await enrollment_model_js_1.Enrollment.findByIdAndUpdate(enrollmentId, {
            overallAttendanceRate: rate,
        });
        return rate;
    }
}
exports.AttendanceEngine = AttendanceEngine;
//# sourceMappingURL=attendance.engine.js.map