import { Request, Response } from "express";
import {
  Cohort,
  TrainingSession,
  TrainingCalendarEvent,
} from "../models/cohort.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { EnrollmentStatus } from "../constants/enums.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { AuditService } from "../services/audit/audit.service.js";
import { asyncHandler, sendSuccess, AppError } from "../utils/index.js";

export class CohortController {
  // Cohorts
  public static getCohorts = asyncHandler(
    async (req: Request, res: Response) => {
      const { programId, centreId, status } = req.query;
      const filter: any = {};
      if (programId) filter.programId = programId;
      if (centreId) filter.centreId = centreId;
      if (status) filter.status = status;

      const cohorts = await Cohort.find(filter)
        .populate("programId", "title code organizerName")
        .populate("centreId", "name centreCode state lga")
        .populate("skillConfigs.skillAreaId", "name code category")
        .populate("skillConfigs.trainerStaffIds", "firstName lastName position")
        .populate("skillConfigs.assignedRoomId", "name roomNumber capacity")
        .sort({ startDate: -1 });

      // Calculate dynamic capacity metrics per cohort
      const enriched = await Promise.all(
        cohorts.map(async (c) => {
          const activeCount = await Enrollment.countDocuments({
            cohortId: c._id,
            status: EnrollmentStatus.ACTIVE,
          });
          const selectedCount = await Enrollment.countDocuments({
            cohortId: c._id,
            status: {
              $in: [
                EnrollmentStatus.SELECTED,
                EnrollmentStatus.AWAITING_VERIFICATION,
                EnrollmentStatus.AWAITING_BIOMETRIC,
              ],
            },
          });
          const droppedCount = await Enrollment.countDocuments({
            cohortId: c._id,
            status: EnrollmentStatus.DROPPED,
          });
          const withdrawnCount = await Enrollment.countDocuments({
            cohortId: c._id,
            status: EnrollmentStatus.WITHDRAWN,
          });
          const completedCount = await Enrollment.countDocuments({
            cohortId: c._id,
            status: EnrollmentStatus.COMPLETED,
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
        }),
      );

      sendSuccess(res, enriched);
    },
  );

  public static getCohortById = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const cohort = await Cohort.findById(id)
        .populate("programId")
        .populate("centreId")
        .populate("skillConfigs.skillAreaId")
        .populate("skillConfigs.trainerStaffIds")
        .populate("skillConfigs.assignedRoomId");

      if (!cohort) {
        throw new AppError("Cohort not found", 404);
      }

      const activeEnrollments = await Enrollment.find({ cohortId: id })
        .populate("beneficiaryId")
        .populate("skillAreaId", "name code");

      const activeCount = await Enrollment.countDocuments({
        cohortId: id,
        status: EnrollmentStatus.ACTIVE,
      });
      const selectedCount = await Enrollment.countDocuments({
        cohortId: id,
        status: {
          $in: [
            EnrollmentStatus.SELECTED,
            EnrollmentStatus.AWAITING_VERIFICATION,
            EnrollmentStatus.AWAITING_BIOMETRIC,
          ],
        },
      });
      const droppedCount = await Enrollment.countDocuments({
        cohortId: id,
        status: EnrollmentStatus.DROPPED,
      });
      const withdrawnCount = await Enrollment.countDocuments({
        cohortId: id,
        status: EnrollmentStatus.WITHDRAWN,
      });
      const completedCount = await Enrollment.countDocuments({
        cohortId: id,
        status: EnrollmentStatus.COMPLETED,
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

      sendSuccess(res, {
        cohort: enrichedCohort,
        enrollments: activeEnrollments,
      });
    },
  );

  public static createCohort = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const cohort = await Cohort.create(req.body);

      // Automatically generate training sessions based on skillConfigs and date range
      await CohortController.generateInitialSessions(cohort);

      await AuditService.log({
        req,
        action: "COHORT_CREATED",
        entityType: "Cohort",
        entityId: cohort._id.toString(),
        centreId: cohort.centreId.toString(),
        programId: cohort.programId.toString(),
        cohortId: cohort._id.toString(),
        afterState: cohort.toObject(),
      });

      sendSuccess(res, cohort, "Cohort created with scheduled sessions", 201);
    },
  );

  public static updateCohort = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const updated = await Cohort.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) {
        throw new AppError("Cohort not found", 404);
      }
      sendSuccess(res, updated, "Cohort updated");
    },
  );

  // Generate sessions for cohort from skill configs
  private static async generateInitialSessions(cohort: any) {
    const sessions: any[] = [];
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
      await TrainingSession.insertMany(sessions);
    }
  }

  // Timetable Sessions
  public static getSessions = asyncHandler(
    async (req: Request, res: Response) => {
      const {
        cohortId,
        centreId,
        skillAreaId,
        startDate,
        endDate,
        publishedOnly,
        slotNumber,
      } = req.query;
      const filter: any = {};
      if (cohortId) filter.cohortId = cohortId;
      if (centreId) filter.centreId = centreId;
      if (skillAreaId) filter.skillAreaId = skillAreaId;
      if (slotNumber) filter.slotNumber = parseInt(slotNumber as string, 10);
      if (publishedOnly === "true") {
        filter.isPublished = true;
      }
      if (startDate && endDate) {
        filter.sessionDate = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const sessions = await TrainingSession.find(filter)
        .populate("cohortId", "name cohortCode timetableStatus")
        .populate("programId", "title code")
        .populate("centreId", "name centreCode")
        .populate("skillAreaId", "name code category")
        .populate("trainerStaffId", "firstName lastName position phone")
        .populate("roomId", "name roomNumber")
        .sort({ sessionDate: 1, startTime: 1 });

      sendSuccess(res, sessions);
    },
  );

  // Save or update Timetable Draft (with 2-3 daily session slots)
  public static saveTimetableDraft = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { slots, publishImmediately } = req.body;

      const cohort = await Cohort.findById(id);
      if (!cohort) {
        throw new AppError("Cohort not found", 404);
      }

      if (!slots || !Array.isArray(slots) || slots.length === 0) {
        throw new AppError(
          "At least 1 timetable slot is required (up to 3 slots)",
          400,
        );
      }

      // Save slots to cohort
      cohort.timetableSlots = slots as any;
      if (publishImmediately) {
        cohort.timetableStatus = "published";
        cohort.timetablePublishedAt = new Date();
      } else {
        cohort.timetableStatus = "draft";
      }
      await cohort.save();

      // Re-generate sessions from the configured slots
      await TrainingSession.deleteMany({
        cohortId: cohort._id,
        attendanceProcessed: { $ne: true },
      });

      const newSessions: any[] = [];
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
        await TrainingSession.insertMany(newSessions);
      }

      await AuditService.log({
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

      sendSuccess(
        res,
        { cohort, sessionCount: newSessions.length },
        publishImmediately
          ? "Timetable published successfully"
          : "Timetable draft saved successfully",
      );
    },
  );

  // Publish Timetable
  public static publishTimetable = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const cohort = await Cohort.findById(id);
      if (!cohort) {
        throw new AppError("Cohort not found", 404);
      }

      cohort.timetableStatus = "published";
      cohort.timetablePublishedAt = new Date();
      await cohort.save();

      await TrainingSession.updateMany(
        { cohortId: cohort._id },
        { isPublished: true },
      );

      await AuditService.log({
        req,
        action: "TIMETABLE_PUBLISHED",
        entityType: "Cohort",
        entityId: cohort._id.toString(),
        centreId: cohort.centreId?.toString(),
        afterState: { timetableStatus: "published" },
      });

      sendSuccess(res, cohort, "Cohort timetable published to trainees");
    },
  );

  // Unpublish Timetable (revert to draft)
  public static unpublishTimetable = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const cohort = await Cohort.findById(id);
      if (!cohort) {
        throw new AppError("Cohort not found", 404);
      }

      cohort.timetableStatus = "draft";
      await cohort.save();

      await TrainingSession.updateMany(
        { cohortId: cohort._id },
        { isPublished: false },
      );

      await AuditService.log({
        req,
        action: "TIMETABLE_UNPUBLISHED",
        entityType: "Cohort",
        entityId: cohort._id.toString(),
        centreId: cohort.centreId?.toString(),
        afterState: { timetableStatus: "draft" },
      });

      sendSuccess(res, cohort, "Cohort timetable reverted to draft");
    },
  );

  public static cancelSession = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      const { reason } = req.body;
      const session = await TrainingSession.findByIdAndUpdate(
        id,
        { isCancelled: true, cancellationReason: reason },
        { new: true },
      );
      if (!session) {
        throw new AppError("Session not found", 404);
      }
      sendSuccess(res, session, "Session cancelled without attendance penalty");
    },
  );

  // Calendar Events (Holidays, Closures, Exceptions)
  public static getCalendarEvents = asyncHandler(
    async (req: Request, res: Response) => {
      const { centreId, startDate, endDate } = req.query;
      const filter: any = {};
      if (centreId) {
        filter.$or = [
          { centreId },
          { centreId: { $exists: false } },
          { centreId: null },
        ];
      }
      if (startDate && endDate) {
        filter.startDate = { $lte: new Date(endDate as string) };
        filter.endDate = { $gte: new Date(startDate as string) };
      }

      const events = await TrainingCalendarEvent.find(filter)
        .populate("centreId", "name centreCode")
        .sort({ startDate: 1 });
      sendSuccess(res, events);
    },
  );

  public static createCalendarEvent = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const event = await TrainingCalendarEvent.create({
        ...req.body,
        createdBy: req.user?.userId,
      });

      await AuditService.log({
        req,
        action: "CALENDAR_EVENT_CREATED",
        entityType: "TrainingCalendarEvent",
        entityId: event._id.toString(),
        centreId: event.centreId?.toString(),
        afterState: event.toObject(),
      });

      sendSuccess(res, event, "Calendar event recorded", 201);
    },
  );
}
