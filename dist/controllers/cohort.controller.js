"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortController = void 0;
const cohort_model_js_1 = require("../models/cohort.model.js");
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const enums_js_1 = require("../constants/enums.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class CohortController {
    // Cohorts
    static getCohorts = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { programId, centreId, status } = req.query;
        const filter = {};
        if (programId)
            filter.programId = programId;
        if (centreId)
            filter.centreId = centreId;
        if (status)
            filter.status = status;
        const cohorts = await cohort_model_js_1.Cohort.find(filter)
            .populate("programId", "title code organizerName")
            .populate("centreId", "name centreCode state lga")
            .populate("skillConfigs.skillAreaId", "name code category")
            .populate("skillConfigs.trainerStaffIds", "firstName lastName position")
            .populate("skillConfigs.assignedRoomId", "name roomNumber capacity")
            .sort({ startDate: -1 });
        // Calculate dynamic capacity metrics per cohort
        const enriched = await Promise.all(cohorts.map(async (c) => {
            const activeCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: c._id,
                status: enums_js_1.EnrollmentStatus.ACTIVE,
            });
            const selectedCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: c._id,
                status: {
                    $in: [
                        enums_js_1.EnrollmentStatus.SELECTED,
                        enums_js_1.EnrollmentStatus.AWAITING_VERIFICATION,
                        enums_js_1.EnrollmentStatus.AWAITING_BIOMETRIC,
                    ],
                },
            });
            const droppedCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: c._id,
                status: enums_js_1.EnrollmentStatus.DROPPED,
            });
            const withdrawnCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: c._id,
                status: enums_js_1.EnrollmentStatus.WITHDRAWN,
            });
            const completedCount = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: c._id,
                status: enums_js_1.EnrollmentStatus.COMPLETED,
            });
            const totalOccupied = activeCount + selectedCount;
            const availableSlots = Math.max(0, c.maxCapacity - totalOccupied);
            return {
                ...c.toObject(),
                capacityMetrics: {
                    maxCapacity: c.maxCapacity,
                    active: activeCount,
                    selectedPending: selectedCount,
                    dropped: droppedCount,
                    withdrawn: withdrawnCount,
                    completed: completedCount,
                    availableSlots,
                },
            };
        }));
        (0, index_js_1.sendSuccess)(res, enriched);
    });
    static getCohortById = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const cohort = await cohort_model_js_1.Cohort.findById(id)
            .populate("programId")
            .populate("centreId")
            .populate("skillConfigs.skillAreaId")
            .populate("skillConfigs.trainerStaffIds")
            .populate("skillConfigs.assignedRoomId");
        if (!cohort) {
            throw new index_js_1.AppError("Cohort not found", 404);
        }
        const activeEnrollments = await enrollment_model_js_1.Enrollment.find({ cohortId: id })
            .populate("beneficiaryId")
            .populate("skillAreaId", "name code");
        const activeCount = await enrollment_model_js_1.Enrollment.countDocuments({
            cohortId: id,
            status: enums_js_1.EnrollmentStatus.ACTIVE,
        });
        const selectedCount = await enrollment_model_js_1.Enrollment.countDocuments({
            cohortId: id,
            status: {
                $in: [
                    enums_js_1.EnrollmentStatus.SELECTED,
                    enums_js_1.EnrollmentStatus.AWAITING_VERIFICATION,
                    enums_js_1.EnrollmentStatus.AWAITING_BIOMETRIC,
                ],
            },
        });
        const droppedCount = await enrollment_model_js_1.Enrollment.countDocuments({
            cohortId: id,
            status: enums_js_1.EnrollmentStatus.DROPPED,
        });
        const withdrawnCount = await enrollment_model_js_1.Enrollment.countDocuments({
            cohortId: id,
            status: enums_js_1.EnrollmentStatus.WITHDRAWN,
        });
        const completedCount = await enrollment_model_js_1.Enrollment.countDocuments({
            cohortId: id,
            status: enums_js_1.EnrollmentStatus.COMPLETED,
        });
        const totalOccupied = activeCount + selectedCount;
        const availableSlots = Math.max(0, cohort.maxCapacity - totalOccupied);
        const enrichedCohort = {
            ...cohort.toObject(),
            capacityMetrics: {
                maxCapacity: cohort.maxCapacity,
                active: activeCount,
                selectedPending: selectedCount,
                dropped: droppedCount,
                withdrawn: withdrawnCount,
                completed: completedCount,
                availableSlots,
            },
        };
        (0, index_js_1.sendSuccess)(res, {
            cohort: enrichedCohort,
            enrollments: activeEnrollments,
        });
    });
    static createCohort = (0, index_js_1.asyncHandler)(async (req, res) => {
        const cohort = await cohort_model_js_1.Cohort.create(req.body);
        // Automatically generate training sessions based on skillConfigs and date range
        await CohortController.generateInitialSessions(cohort);
        await audit_service_js_1.AuditService.log({
            req,
            action: "COHORT_CREATED",
            entityType: "Cohort",
            entityId: cohort._id.toString(),
            centreId: cohort.centreId.toString(),
            programId: cohort.programId.toString(),
            cohortId: cohort._id.toString(),
            afterState: cohort.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, cohort, "Cohort created with scheduled sessions", 201);
    });
    static updateCohort = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const updated = await cohort_model_js_1.Cohort.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updated) {
            throw new index_js_1.AppError("Cohort not found", 404);
        }
        (0, index_js_1.sendSuccess)(res, updated, "Cohort updated");
    });
    // Generate sessions for cohort from skill configs
    static async generateInitialSessions(cohort) {
        const sessions = [];
        const start = new Date(cohort.startDate);
        const end = new Date(cohort.endDate);
        for (const config of cohort.skillConfigs) {
            const curr = new Date(start);
            while (curr <= end) {
                const dayOfWeek = curr.getDay(); // 0=Sun, 1=Mon...
                if (config.daysOfWeek.includes(dayOfWeek)) {
                    sessions.push({
                        cohortId: cohort._id,
                        programId: cohort.programId,
                        centreId: cohort.centreId,
                        skillAreaId: config.skillAreaId,
                        trainerStaffId: config.trainerStaffIds?.[0],
                        roomId: config.assignedRoomId,
                        sessionDate: new Date(curr),
                        startTime: config.startTime,
                        endTime: config.endTime,
                        sessionType: "Regular Practical",
                        isCancelled: false,
                    });
                }
                curr.setDate(curr.getDate() + 1);
            }
        }
        if (sessions.length > 0) {
            await cohort_model_js_1.TrainingSession.insertMany(sessions);
        }
    }
    // Timetable Sessions
    static getSessions = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { cohortId, centreId, skillAreaId, startDate, endDate, publishedOnly, slotNumber, } = req.query;
        const filter = {};
        if (cohortId)
            filter.cohortId = cohortId;
        if (centreId)
            filter.centreId = centreId;
        if (skillAreaId)
            filter.skillAreaId = skillAreaId;
        if (slotNumber)
            filter.slotNumber = parseInt(slotNumber, 10);
        if (publishedOnly === "true") {
            filter.isPublished = true;
        }
        if (startDate && endDate) {
            filter.sessionDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        const sessions = await cohort_model_js_1.TrainingSession.find(filter)
            .populate("cohortId", "name cohortCode timetableStatus")
            .populate("programId", "title code")
            .populate("centreId", "name centreCode")
            .populate("skillAreaId", "name code category")
            .populate("trainerStaffId", "firstName lastName position phone")
            .populate("roomId", "name roomNumber")
            .sort({ sessionDate: 1, startTime: 1 });
        (0, index_js_1.sendSuccess)(res, sessions);
    });
    // Save or update Timetable Draft (with 2-3 daily session slots)
    static saveTimetableDraft = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { slots, publishImmediately } = req.body;
        const cohort = await cohort_model_js_1.Cohort.findById(id);
        if (!cohort) {
            throw new index_js_1.AppError("Cohort not found", 404);
        }
        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            throw new index_js_1.AppError("At least 1 timetable slot is required (up to 3 slots)", 400);
        }
        // Save slots to cohort
        cohort.timetableSlots = slots;
        if (publishImmediately) {
            cohort.timetableStatus = "published";
            cohort.timetablePublishedAt = new Date();
        }
        else {
            cohort.timetableStatus = "draft";
        }
        await cohort.save();
        // Re-generate sessions from the configured slots
        await cohort_model_js_1.TrainingSession.deleteMany({
            cohortId: cohort._id,
            attendanceProcessed: { $ne: true },
        });
        const newSessions = [];
        const start = new Date(cohort.startDate);
        const end = new Date(cohort.endDate);
        const isPublished = cohort.timetableStatus === "published";
        for (const slot of slots) {
            const curr = new Date(start);
            while (curr <= end) {
                const dayOfWeek = curr.getDay();
                if (slot.daysOfWeek && slot.daysOfWeek.includes(dayOfWeek)) {
                    for (const skillId of slot.skillAreaIds || []) {
                        newSessions.push({
                            cohortId: cohort._id,
                            programId: cohort.programId,
                            centreId: cohort.centreId,
                            skillAreaId: skillId,
                            roomId: slot.roomId || undefined,
                            sessionDate: new Date(curr),
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            slotNumber: slot.slotNumber || 1,
                            sessionType: "Regular Practical",
                            isPublished,
                            isCancelled: false,
                        });
                    }
                }
                curr.setDate(curr.getDate() + 1);
            }
        }
        if (newSessions.length > 0) {
            await cohort_model_js_1.TrainingSession.insertMany(newSessions);
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: publishImmediately
                ? "TIMETABLE_PUBLISHED"
                : "TIMETABLE_DRAFTED",
            entityType: "Cohort",
            entityId: cohort._id.toString(),
            centreId: cohort.centreId?.toString(),
            afterState: {
                timetableStatus: cohort.timetableStatus,
                slotCount: slots.length,
                sessionCount: newSessions.length,
            },
        });
        (0, index_js_1.sendSuccess)(res, { cohort, sessionCount: newSessions.length }, publishImmediately
            ? "Timetable published successfully"
            : "Timetable draft saved successfully");
    });
    // Publish Timetable
    static publishTimetable = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const cohort = await cohort_model_js_1.Cohort.findById(id);
        if (!cohort) {
            throw new index_js_1.AppError("Cohort not found", 404);
        }
        cohort.timetableStatus = "published";
        cohort.timetablePublishedAt = new Date();
        await cohort.save();
        await cohort_model_js_1.TrainingSession.updateMany({ cohortId: cohort._id }, { isPublished: true });
        await audit_service_js_1.AuditService.log({
            req,
            action: "TIMETABLE_PUBLISHED",
            entityType: "Cohort",
            entityId: cohort._id.toString(),
            centreId: cohort.centreId?.toString(),
            afterState: { timetableStatus: "published" },
        });
        (0, index_js_1.sendSuccess)(res, cohort, "Cohort timetable published to trainees");
    });
    // Unpublish Timetable (revert to draft)
    static unpublishTimetable = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const cohort = await cohort_model_js_1.Cohort.findById(id);
        if (!cohort) {
            throw new index_js_1.AppError("Cohort not found", 404);
        }
        cohort.timetableStatus = "draft";
        await cohort.save();
        await cohort_model_js_1.TrainingSession.updateMany({ cohortId: cohort._id }, { isPublished: false });
        await audit_service_js_1.AuditService.log({
            req,
            action: "TIMETABLE_UNPUBLISHED",
            entityType: "Cohort",
            entityId: cohort._id.toString(),
            centreId: cohort.centreId?.toString(),
            afterState: { timetableStatus: "draft" },
        });
        (0, index_js_1.sendSuccess)(res, cohort, "Cohort timetable reverted to draft");
    });
    static cancelSession = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;
        const session = await cohort_model_js_1.TrainingSession.findByIdAndUpdate(id, { isCancelled: true, cancellationReason: reason }, { new: true });
        if (!session) {
            throw new index_js_1.AppError("Session not found", 404);
        }
        (0, index_js_1.sendSuccess)(res, session, "Session cancelled without attendance penalty");
    });
    // Calendar Events (Holidays, Closures, Exceptions)
    static getCalendarEvents = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, startDate, endDate } = req.query;
        const filter = {};
        if (centreId) {
            filter.$or = [
                { centreId },
                { centreId: { $exists: false } },
                { centreId: null },
            ];
        }
        if (startDate && endDate) {
            filter.startDate = { $lte: new Date(endDate) };
            filter.endDate = { $gte: new Date(startDate) };
        }
        const events = await cohort_model_js_1.TrainingCalendarEvent.find(filter)
            .populate("centreId", "name centreCode")
            .sort({ startDate: 1 });
        (0, index_js_1.sendSuccess)(res, events);
    });
    static createCalendarEvent = (0, index_js_1.asyncHandler)(async (req, res) => {
        const event = await cohort_model_js_1.TrainingCalendarEvent.create({
            ...req.body,
            createdBy: req.user?.userId,
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: "CALENDAR_EVENT_CREATED",
            entityType: "TrainingCalendarEvent",
            entityId: event._id.toString(),
            centreId: event.centreId?.toString(),
            afterState: event.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, event, "Calendar event recorded", 201);
    });
}
exports.CohortController = CohortController;
//# sourceMappingURL=cohort.controller.js.map