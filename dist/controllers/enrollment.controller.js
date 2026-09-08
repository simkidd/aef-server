"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentController = void 0;
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const application_model_js_1 = require("../models/application.model.js");
const beneficiaryProfile_model_js_1 = require("../models/beneficiaryProfile.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const enums_js_1 = require("../constants/enums.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const notification_service_js_1 = require("../services/notification/notification.service.js");
const biometric_service_js_1 = require("../services/biometrics/biometric.service.js");
const index_js_1 = require("../utils/index.js");
class EnrollmentController {
    // Get Enrollment Queue
    static getEnrollmentQueue = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, programId, cohortId, status, page, limit } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        if (programId)
            filter.programId = programId;
        if (cohortId)
            filter.cohortId = cohortId;
        if (status)
            filter.status = status;
        const result = await (0, index_js_1.paginate)(enrollment_model_js_1.Enrollment, filter, {
            page: page,
            limit: limit,
            sort: { updatedAt: -1 },
            populate: [
                { path: 'beneficiaryId' },
                { path: 'programId', select: 'title code organizerName' },
                { path: 'cohortId', select: 'name cohortCode maxCapacity' },
                { path: 'skillAreaId', select: 'name code category' },
                { path: 'centreId', select: 'name centreCode' },
                { path: 'verificationDetails.verifiedByStaffId', select: 'firstName lastName' },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Enrollment queue retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    // Step 1: Physical Verification
    static verifyPhysical = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { documentsChecked, identityVerified, physicalNotes, hasIssue } = req.body;
        const enrollment = await enrollment_model_js_1.Enrollment.findById(id);
        if (!enrollment) {
            throw new index_js_1.AppError('Enrollment record not found', 404);
        }
        const nextStatus = hasIssue ? enums_js_1.EnrollmentStatus.VERIFICATION_ISSUE : enums_js_1.EnrollmentStatus.AWAITING_BIOMETRIC;
        enrollment.status = nextStatus;
        enrollment.verificationDetails = {
            verifiedByStaffId: req.user?.staffRecordId,
            verifiedAt: new Date(),
            documentsChecked: !!documentsChecked,
            identityVerified: !!identityVerified,
            physicalNotes,
        };
        enrollment.statusHistory.push({
            status: nextStatus,
            changedBy: req.user?.userId,
            changedAt: new Date(),
            reason: physicalNotes || (hasIssue ? 'Verification discrepancy identified' : 'Physical documents verified successfully'),
        });
        await enrollment.save();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'PHYSICAL_VERIFICATION_COMPLETED',
            entityType: 'Enrollment',
            entityId: enrollment._id.toString(),
            centreId: enrollment.centreId.toString(),
            cohortId: enrollment.cohortId.toString(),
            afterState: { status: nextStatus, verificationDetails: enrollment.verificationDetails },
        });
        (0, index_js_1.sendSuccess)(res, enrollment, `Verification status updated: ${nextStatus}`);
    });
    // Step 2: Register Biometrics & Confirm Enrollment
    static registerBiometricAndEnroll = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { deviceId, rawSample } = req.body;
        const enrollment = await enrollment_model_js_1.Enrollment.findById(id).populate('beneficiaryId');
        if (!enrollment) {
            throw new index_js_1.AppError('Enrollment record not found', 404);
        }
        // Check cohort capacity limit before finalizing
        const cohort = await cohort_model_js_1.Cohort.findById(enrollment.cohortId);
        if (cohort) {
            const currentActive = await enrollment_model_js_1.Enrollment.countDocuments({
                cohortId: cohort._id,
                status: enums_js_1.EnrollmentStatus.ACTIVE,
            });
            if (currentActive >= cohort.maxCapacity) {
                throw new index_js_1.AppError(`Cohort capacity reached (${currentActive}/${cohort.maxCapacity}). Cannot confirm enrollment.`, 400);
            }
        }
        // Check one active primary training rule for beneficiary
        const existingActive = await enrollment_model_js_1.Enrollment.findOne({
            beneficiaryId: enrollment.beneficiaryId._id,
            status: enums_js_1.EnrollmentStatus.ACTIVE,
            _id: { $ne: enrollment._id },
        });
        if (existingActive) {
            throw new index_js_1.AppError('This beneficiary is already actively enrolled in another ongoing training cohort. The organization policy allows only one active primary training.', 409);
        }
        // 1. Register Biometrics via BiometricService
        const identity = await biometric_service_js_1.BiometricService.registerTraineeBiometrics({
            beneficiaryId: enrollment.beneficiaryId._id.toString(),
            centreId: enrollment.centreId.toString(),
            deviceId: deviceId || '67c756200000000000000001',
            staffId: req.user?.staffRecordId || req.user.userId,
            rawSample,
        });
        // 2. Transition enrollment to ACTIVE
        enrollment.status = enums_js_1.EnrollmentStatus.ACTIVE;
        enrollment.enrollmentDate = new Date();
        enrollment.biometricRegistrationDetails = {
            registeredByStaffId: req.user?.staffRecordId,
            registeredAt: new Date(),
            deviceId: deviceId,
            biometricIdentifier: identity.biometricToken,
        };
        enrollment.statusHistory.push({
            status: enums_js_1.EnrollmentStatus.ACTIVE,
            changedBy: req.user?.userId,
            changedAt: new Date(),
            reason: 'Biometric registration completed and enrollment confirmed',
        });
        await enrollment.save();
        // 3. Update Beneficiary profile with active enrollment
        await beneficiaryProfile_model_js_1.BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId._id, {
            activeEnrollmentId: enrollment._id,
        });
        // 4. Update Application status to ENROLLMENT_CONFIRMED
        await application_model_js_1.Application.findByIdAndUpdate(enrollment.applicationId, {
            status: enums_js_1.ApplicationStatus.ENROLLMENT_CONFIRMED,
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ENROLLMENT_CONFIRMED_ACTIVE',
            entityType: 'Enrollment',
            entityId: enrollment._id.toString(),
            centreId: enrollment.centreId.toString(),
            cohortId: enrollment.cohortId.toString(),
            afterState: { status: enums_js_1.EnrollmentStatus.ACTIVE, biometricToken: identity.biometricToken },
        });
        // Send notification
        const beneficiaryUser = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findById(enrollment.beneficiaryId._id).select('userId');
        if (beneficiaryUser?.userId) {
            await notification_service_js_1.NotificationService.send({
                recipientUserId: beneficiaryUser.userId.toString(),
                title: 'Enrollment Confirmed!',
                message: 'Your biometric registration is complete and you are now an active trainee. Check your Timetable for upcoming sessions.',
                type: 'SUCCESS',
            });
        }
        (0, index_js_1.sendSuccess)(res, enrollment, 'Biometrics registered and trainee successfully enrolled into cohort');
    });
    // Dropping a Trainee (Non-destructive status transition)
    static dropTrainee = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;
        if (!reason) {
            throw new index_js_1.AppError('A reason is required when dropping a trainee.', 400);
        }
        const enrollment = await enrollment_model_js_1.Enrollment.findById(id);
        if (!enrollment) {
            throw new index_js_1.AppError('Enrollment not found', 404);
        }
        const prevStatus = enrollment.status;
        enrollment.status = enums_js_1.EnrollmentStatus.DROPPED;
        enrollment.droppedDate = new Date();
        enrollment.dropReason = reason;
        enrollment.statusHistory.push({
            status: enums_js_1.EnrollmentStatus.DROPPED,
            changedBy: req.user?.userId,
            changedAt: new Date(),
            reason,
        });
        await enrollment.save();
        // Clear active enrollment pointer on beneficiary profile
        await beneficiaryProfile_model_js_1.BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId, {
            $unset: { activeEnrollmentId: 1 },
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'TRAINEE_DROPPED',
            entityType: 'Enrollment',
            entityId: enrollment._id.toString(),
            centreId: enrollment.centreId.toString(),
            cohortId: enrollment.cohortId.toString(),
            beforeState: { status: prevStatus },
            afterState: { status: enums_js_1.EnrollmentStatus.DROPPED, dropReason: reason },
            reason,
        });
        (0, index_js_1.sendSuccess)(res, enrollment, 'Trainee status updated to Dropped. Cohort slot is now available.');
    });
    // Trainee Withdrawal
    static withdrawTrainee = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;
        const enrollment = await enrollment_model_js_1.Enrollment.findById(id);
        if (!enrollment) {
            throw new index_js_1.AppError('Enrollment not found', 404);
        }
        enrollment.status = enums_js_1.EnrollmentStatus.WITHDRAWN;
        enrollment.statusReason = reason || 'Voluntary trainee withdrawal';
        enrollment.statusHistory.push({
            status: enums_js_1.EnrollmentStatus.WITHDRAWN,
            changedBy: req.user?.userId,
            changedAt: new Date(),
            reason,
        });
        await enrollment.save();
        await beneficiaryProfile_model_js_1.BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId, { $unset: { activeEnrollmentId: 1 } });
        (0, index_js_1.sendSuccess)(res, enrollment, 'Trainee withdrawn');
    });
    // Get active enrollment for current beneficiary (Portal)
    static getMyActiveTraining = (0, index_js_1.asyncHandler)(async (req, res) => {
        let beneficiaryId = req.user?.beneficiaryProfileId;
        if (!beneficiaryId) {
            const profile = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findOne({ userId: req.user?.userId });
            beneficiaryId = profile?._id.toString();
        }
        if (!beneficiaryId) {
            throw new index_js_1.AppError('Beneficiary profile not found', 404);
        }
        const activeEnrollment = await enrollment_model_js_1.Enrollment.findOne({
            beneficiaryId,
            status: { $in: [enums_js_1.EnrollmentStatus.ACTIVE, enums_js_1.EnrollmentStatus.SELECTED, enums_js_1.EnrollmentStatus.AWAITING_BIOMETRIC, enums_js_1.EnrollmentStatus.COMPLETED] },
        })
            .populate('programId')
            .populate('cohortId')
            .populate('skillAreaId')
            .populate('centreId')
            .populate('certificateId')
            .sort({ updatedAt: -1 });
        const allHistory = await enrollment_model_js_1.Enrollment.find({ beneficiaryId })
            .populate('programId')
            .populate('cohortId')
            .populate('skillAreaId')
            .populate('centreId')
            .populate('certificateId')
            .sort({ createdAt: -1 });
        (0, index_js_1.sendSuccess)(res, {
            active: activeEnrollment,
            history: allHistory,
        });
    });
}
exports.EnrollmentController = EnrollmentController;
//# sourceMappingURL=enrollment.controller.js.map