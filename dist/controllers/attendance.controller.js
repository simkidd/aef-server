"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const attendance_model_js_1 = require("../models/attendance.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const enums_js_1 = require("../constants/enums.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const attendance_engine_js_1 = require("../services/attendance/attendance.engine.js");
const index_js_1 = require("../utils/index.js");
class AttendanceController {
    // Today's Live Attendance Monitoring across centres
    static getTodaySummary = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId } = req.query;
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        const sessionFilter = { sessionDate: { $gte: startOfDay, $lte: endOfDay }, isCancelled: false };
        if (centreId)
            sessionFilter.centreId = centreId;
        const sessionsToday = await cohort_model_js_1.TrainingSession.find(sessionFilter)
            .populate('cohortId', 'name cohortCode')
            .populate('programId', 'title code')
            .populate('centreId', 'name centreCode')
            .populate('skillAreaId', 'name code')
            .populate('trainerStaffId', 'firstName lastName phone')
            .populate('roomId', 'name roomNumber');
        // For each session, compute live attendance counts
        const sessionSummaries = await Promise.all(sessionsToday.map(async (sess) => {
            const expectedCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: sess.cohortId._id,
                skillAreaId: sess.skillAreaId._id,
                status: enums_js_1.EnrollmentStatus.ACTIVE,
            });
            const records = await attendance_model_js_1.AttendanceRecord.find({
                cohortId: sess.cohortId._id,
                date: { $gte: startOfDay, $lte: endOfDay },
            });
            const present = records.filter((r) => r.status === enums_js_1.AttendanceStatus.PRESENT).length;
            const late = records.filter((r) => r.status === enums_js_1.AttendanceStatus.LATE).length;
            const excused = records.filter((r) => r.status === enums_js_1.AttendanceStatus.EXCUSED).length;
            const arrivedCount = present + late + excused;
            const notYetArrived = Math.max(0, expectedCount - arrivedCount);
            return {
                session: sess,
                metrics: {
                    expectedTrainees: expectedCount,
                    present,
                    late,
                    excused,
                    notYetArrived,
                    attendanceRate: expectedCount > 0 ? Math.round((arrivedCount / expectedCount) * 100) : 0,
                },
            };
        }));
        (0, index_js_1.sendSuccess)(res, {
            date: startOfDay,
            activeSessionsCount: sessionsToday.length,
            sessions: sessionSummaries,
        });
    });
    // Attendance Sheet Matrix with filters
    static getAttendanceSheet = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, cohortId, skillAreaId, date, year, month, status, page, limit } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        if (cohortId)
            filter.cohortId = cohortId;
        if (skillAreaId)
            filter.skillAreaId = skillAreaId;
        if (status)
            filter.status = status;
        if (date) {
            const queryDate = new Date(date);
            const dayStart = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
            const dayEnd = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 23, 59, 59);
            filter.date = { $gte: dayStart, $lte: dayEnd };
        }
        else if (year && month) {
            const y = parseInt(year, 10);
            const m = parseInt(month, 10) - 1; // 0-indexed in JS Date
            const monthStart = new Date(y, m, 1, 0, 0, 0);
            const monthEnd = new Date(y, m + 1, 0, 23, 59, 59);
            filter.date = { $gte: monthStart, $lte: monthEnd };
        }
        else if (year) {
            const y = parseInt(year, 10);
            const yearStart = new Date(y, 0, 1, 0, 0, 0);
            const yearEnd = new Date(y, 11, 31, 23, 59, 59);
            filter.date = { $gte: yearStart, $lte: yearEnd };
        }
        const result = await (0, index_js_1.paginate)(attendance_model_js_1.AttendanceRecord, filter, {
            page: page,
            limit: limit,
            sort: { date: -1, createdAt: -1 },
            populate: [
                { path: 'beneficiaryId', select: 'firstName lastName beneficiaryCode phone gender profilePhotoUrl' },
                { path: 'cohortId', select: 'name cohortCode timetableStatus' },
                { path: 'skillAreaId', select: 'name code' },
                { path: 'centreId', select: 'name centreCode' },
                { path: 'sessionId', select: 'startTime endTime slotNumber topic sessionType isCancelled' },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Attendance sheet retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    // Beneficiary Personal Attendance History (Portal)
    static getMyAttendanceHistory = (0, index_js_1.asyncHandler)(async (req, res) => {
        const beneficiaryId = req.user?.beneficiaryProfileId;
        if (!beneficiaryId) {
            throw new index_js_1.AppError('Beneficiary profile not found', 404);
        }
        const records = await attendance_model_js_1.AttendanceRecord.find({ beneficiaryId })
            .populate('cohortId', 'name cohortCode timetableStatus')
            .populate('skillAreaId', 'name code')
            .populate('centreId', 'name')
            .populate('sessionId', 'startTime endTime slotNumber topic sessionType')
            .sort({ date: -1 });
        const total = records.length;
        const presentCount = records.filter((r) => r.status === enums_js_1.AttendanceStatus.PRESENT).length;
        const lateCount = records.filter((r) => r.status === enums_js_1.AttendanceStatus.LATE).length;
        const absentCount = records.filter((r) => r.status === enums_js_1.AttendanceStatus.ABSENT).length;
        const excusedCount = records.filter((r) => r.status === enums_js_1.AttendanceStatus.EXCUSED).length;
        const rate = total > 0 ? Math.round(((presentCount + lateCount + excusedCount) / total) * 100 * 10) / 10 : 0;
        (0, index_js_1.sendSuccess)(res, {
            stats: {
                totalSessions: total,
                present: presentCount,
                late: lateCount,
                absent: absentCount,
                excused: excusedCount,
                attendanceRate: rate,
            },
            records,
        });
    });
    // Manual Attendance Correction with Mandatory Audit Trail
    static correctAttendance = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { newStatus, newClockIn, newClockOut, reason, supportingEvidenceUrl } = req.body;
        if (!reason) {
            throw new index_js_1.AppError('A mandatory reason is required for manual attendance corrections.', 400);
        }
        const record = await attendance_model_js_1.AttendanceRecord.findById(id);
        if (!record) {
            throw new index_js_1.AppError('Attendance record not found', 404);
        }
        const before = record.toObject();
        // Log correction entry
        await attendance_model_js_1.AttendanceCorrection.create({
            attendanceRecordId: record._id,
            beneficiaryId: record.beneficiaryId,
            cohortId: record.cohortId,
            originalStatus: record.status,
            newStatus,
            originalClockIn: record.firstClockIn,
            newClockIn: newClockIn ? new Date(newClockIn) : record.firstClockIn,
            originalClockOut: record.lastClockOut,
            newClockOut: newClockOut ? new Date(newClockOut) : record.lastClockOut,
            reason,
            supportingEvidenceUrl,
            correctedByStaffId: req.user?.staffRecordId || req.user.userId,
        });
        // Update record
        record.status = newStatus;
        if (newClockIn)
            record.firstClockIn = new Date(newClockIn);
        if (newClockOut)
            record.lastClockOut = new Date(newClockOut);
        record.isManualCorrection = true;
        record.notes = `Corrected by ${req.user?.firstName} ${req.user?.lastName}: ${reason}`;
        await record.save();
        // Recalculate enrollment attendance rate
        await attendance_engine_js_1.AttendanceEngine.recalculateEnrollmentAttendance(record.enrollmentId.toString());
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ATTENDANCE_MANUALLY_CORRECTED',
            entityType: 'AttendanceRecord',
            entityId: record._id.toString(),
            centreId: record.centreId.toString(),
            cohortId: record.cohortId.toString(),
            beforeState: before,
            afterState: record.toObject(),
            reason,
        });
        (0, index_js_1.sendSuccess)(res, record, 'Attendance corrected and audited successfully');
    });
    // Attendance Policies
    static getPolicies = (0, index_js_1.asyncHandler)(async (req, res) => {
        const policies = await attendance_model_js_1.AttendancePolicy.find().sort({ isDefault: -1, name: 1 });
        (0, index_js_1.sendSuccess)(res, policies);
    });
    static updatePolicy = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const policy = await attendance_model_js_1.AttendancePolicy.findByIdAndUpdate(id, req.body, { new: true, upsert: true });
        (0, index_js_1.sendSuccess)(res, policy, 'Attendance policy saved');
    });
}
exports.AttendanceController = AttendanceController;
//# sourceMappingURL=attendance.controller.js.map