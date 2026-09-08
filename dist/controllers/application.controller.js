"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_model_js_1 = require("../models/application.model.js");
const beneficiaryProfile_model_js_1 = require("../models/beneficiaryProfile.model.js");
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const program_model_js_1 = require("../models/program.model.js");
const enums_js_1 = require("../constants/enums.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const notification_service_js_1 = require("../services/notification/notification.service.js");
const index_js_1 = require("../utils/index.js");
class ApplicationController {
    static getApplications = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { programId, skillAreaId, centreId, status, search, page, limit } = req.query;
        const filter = {};
        if (programId)
            filter.programId = programId;
        if (skillAreaId)
            filter.preferredSkillAreaId = skillAreaId;
        if (centreId)
            filter.preferredCentreId = centreId;
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { applicationNumber: { $regex: search, $options: 'i' } },
                { statementOfPurpose: { $regex: search, $options: 'i' } },
            ];
        }
        const result = await (0, index_js_1.paginate)(application_model_js_1.Application, filter, {
            page: page,
            limit: limit,
            sort: { submittedAt: -1 },
            populate: [
                { path: 'beneficiaryId' },
                { path: 'programId', select: 'title code organizerName' },
                { path: 'preferredSkillAreaId', select: 'name code' },
                { path: 'preferredCentreId', select: 'name centreCode state lga' },
                { path: 'reviewedBy', select: 'firstName lastName' },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Applications retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    static getMyApplications = (0, index_js_1.asyncHandler)(async (req, res) => {
        if (!req.user) {
            throw new index_js_1.AppError('Authentication required.', 401);
        }
        if (!req.user.beneficiaryProfileId) {
            // Try finding profile by userId
            const profile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findOne({ userId: req.user.userId });
            if (!profile) {
                throw new index_js_1.AppError('Beneficiary profile not found.', 404);
            }
            req.user.beneficiaryProfileId = profile._id.toString();
        }
        const applications = await application_model_js_1.Application.find({ beneficiaryId: req.user.beneficiaryProfileId })
            .populate({
            path: 'beneficiaryId',
            select: 'firstName lastName highestEducation phone beneficiaryCode',
        })
            .populate('programId', 'title code organizerName organizerType')
            .populate('preferredSkillAreaId', 'name code category')
            .populate('preferredCentreId', 'name centreCode address state lga')
            .sort({ submittedAt: -1 });
        (0, index_js_1.sendSuccess)(res, applications);
    });
    static submitApplication = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { programId, preferredSkillAreaId, preferredCentreId, statementOfPurpose, previousExperience } = req.body;
        // Locate beneficiary profile
        let profile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findOne({ userId: req.user?.userId });
        if (!profile && req.user?.beneficiaryProfileId) {
            profile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findById(req.user.beneficiaryProfileId);
        }
        if (!profile) {
            throw new index_js_1.AppError('Please complete your beneficiary profile before applying.', 400);
        }
        // Check if already applied to this program
        const existing = await application_model_js_1.Application.findOne({
            beneficiaryId: profile._id,
            programId,
            status: { $nin: [enums_js_1.ApplicationStatus.REJECTED, enums_js_1.ApplicationStatus.WITHDRAWN, enums_js_1.ApplicationStatus.EXPIRED] },
        });
        if (existing) {
            throw new index_js_1.AppError('You have already submitted an active application for this program.', 409);
        }
        const count = await application_model_js_1.Application.countDocuments();
        const appNumber = `AEF-APP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const application = await application_model_js_1.Application.create({
            applicationNumber: appNumber,
            beneficiaryId: profile._id,
            programId,
            preferredSkillAreaId,
            preferredCentreId,
            status: enums_js_1.ApplicationStatus.SUBMITTED,
            statementOfPurpose,
            previousExperience,
            submittedAt: new Date(),
            statusHistory: [
                {
                    status: enums_js_1.ApplicationStatus.SUBMITTED,
                    changedBy: req.user?.userId,
                    changedAt: new Date(),
                    reason: 'Application submitted online',
                },
            ],
        });
        await notification_service_js_1.NotificationService.send({
            recipientUserId: req.user.userId,
            title: 'Application Received',
            message: `Your application (${appNumber}) has been received and is under review.`,
            type: 'SUCCESS',
        });
        (0, index_js_1.sendSuccess)(res, application, 'Application submitted successfully', 201);
    });
    static updateApplicationStatus = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, reason, assignedCohortId } = req.body;
        const application = await application_model_js_1.Application.findById(id).populate('beneficiaryId');
        if (!application) {
            throw new index_js_1.AppError('Application not found', 404);
        }
        const previousStatus = application.status;
        application.status = status;
        application.statusReason = reason;
        application.reviewedBy = req.user?.staffRecordId;
        application.reviewedAt = new Date();
        application.statusHistory.push({
            status,
            changedBy: req.user?.userId,
            changedAt: new Date(),
            reason,
        });
        await application.save();
        // If Selected, create a pending Enrollment entry in the Enrollment Queue!
        if (status === enums_js_1.ApplicationStatus.SELECTED) {
            const cohort = assignedCohortId
                ? await cohort_model_js_1.Cohort.findById(assignedCohortId)
                : await cohort_model_js_1.Cohort.findOne({
                    programId: application.programId,
                    centreId: application.preferredCentreId,
                    status: { $in: ['Upcoming', 'Enrolling'] },
                });
            if (cohort) {
                const count = await enrollment_model_js_1.Enrollment.countDocuments();
                const enrollmentCode = `AEF-ENR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
                await enrollment_model_js_1.Enrollment.findOneAndUpdate({ applicationId: application._id }, {
                    enrollmentCode,
                    beneficiaryId: application.beneficiaryId._id,
                    applicationId: application._id,
                    programId: application.programId,
                    cohortId: cohort._id,
                    skillAreaId: application.preferredSkillAreaId,
                    centreId: cohort.centreId,
                    status: enums_js_1.EnrollmentStatus.SELECTED,
                    statusHistory: [
                        {
                            status: enums_js_1.EnrollmentStatus.SELECTED,
                            changedBy: req.user?.userId,
                            changedAt: new Date(),
                            reason: 'Candidate selected for physical verification & biometric registration',
                        },
                    ],
                }, { upsert: true, new: true });
            }
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: `APPLICATION_STATUS_${status.toUpperCase().replace(/\s+/g, '_')}`,
            entityType: 'Application',
            entityId: application._id.toString(),
            programId: application.programId.toString(),
            beforeState: { status: previousStatus },
            afterState: { status },
            reason,
        });
        // Send in-app notification & Brevo email to candidate
        const beneficiaryProfile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findById(application.beneficiaryId);
        if (beneficiaryProfile?.userId) {
            await notification_service_js_1.NotificationService.send({
                recipientUserId: beneficiaryProfile.userId.toString(),
                title: `Application Status: ${status}`,
                message: status === enums_js_1.ApplicationStatus.SELECTED
                    ? `Congratulations! You have been selected. Please proceed to your assigned training centre for physical verification and biometric registration.`
                    : `Your application status has been updated to ${status}.`,
                type: status === enums_js_1.ApplicationStatus.SELECTED ? 'SUCCESS' : 'INFO',
            });
        }
        if (beneficiaryProfile?.email) {
            const program = await program_model_js_1.Program.findById(application.programId).select('title');
            (0, index_js_1.sendApplicationStatusEmail)(beneficiaryProfile.email, {
                name: `${beneficiaryProfile.firstName} ${beneficiaryProfile.lastName}`,
                applicationNumber: application.applicationNumber,
                programTitle: program?.title || 'Adele Empowerment Program',
                status,
                details: reason,
            }).catch(() => { });
        }
        (0, index_js_1.sendSuccess)(res, application, `Application updated to ${status}`);
    });
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map