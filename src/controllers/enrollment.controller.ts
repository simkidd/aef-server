import { Request, Response } from 'express';
import { Enrollment } from '../models/enrollment.model.js';
import { Application } from '../models/application.model.js';
import { BeneficiaryProfile } from '../models/beneficiaryProfile.model.js';
import { Cohort } from '../models/cohort.model.js';
import { ApplicationStatus, EnrollmentStatus } from '../constants/enums.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { NotificationService } from '../services/notification/notification.service.js';
import { BiometricService } from '../services/biometrics/biometric.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';

export class EnrollmentController {
  // Get Enrollment Queue
  public static getEnrollmentQueue = asyncHandler(async (req: Request, res: Response) => {
    const { centreId, programId, cohortId, status, page, limit } = req.query;
    const filter: any = {};
    if (centreId) filter.centreId = centreId;
    if (programId) filter.programId = programId;
    if (cohortId) filter.cohortId = cohortId;
    if (status) filter.status = status;

    const result = await paginate(Enrollment, filter, {
      page: page as string,
      limit: limit as string,
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

    sendSuccess(res, result.docs, 'Enrollment queue retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  // Step 1: Physical Verification
  public static verifyPhysical = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { documentsChecked, identityVerified, physicalNotes, hasIssue } = req.body;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment record not found', 404);
    }

    const nextStatus = hasIssue ? EnrollmentStatus.VERIFICATION_ISSUE : EnrollmentStatus.AWAITING_BIOMETRIC;

    enrollment.status = nextStatus;
    enrollment.verificationDetails = {
      verifiedByStaffId: req.user?.staffRecordId as any,
      verifiedAt: new Date(),
      documentsChecked: !!documentsChecked,
      identityVerified: !!identityVerified,
      physicalNotes,
    };

    enrollment.statusHistory.push({
      status: nextStatus,
      changedBy: req.user?.userId as any,
      changedAt: new Date(),
      reason: physicalNotes || (hasIssue ? 'Verification discrepancy identified' : 'Physical documents verified successfully'),
    });

    await enrollment.save();

    await AuditService.log({
      req,
      action: 'PHYSICAL_VERIFICATION_COMPLETED',
      entityType: 'Enrollment',
      entityId: enrollment._id.toString(),
      centreId: enrollment.centreId.toString(),
      cohortId: enrollment.cohortId.toString(),
      afterState: { status: nextStatus, verificationDetails: enrollment.verificationDetails },
    });

    sendSuccess(res, enrollment, `Verification status updated: ${nextStatus}`);
  });

  // Step 2: Register Biometrics & Confirm Enrollment
  public static registerBiometricAndEnroll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { deviceId, rawSample } = req.body;

    const enrollment = await Enrollment.findById(id).populate('beneficiaryId');
    if (!enrollment) {
      throw new AppError('Enrollment record not found', 404);
    }

    // Check cohort capacity limit before finalizing
    const cohort = await Cohort.findById(enrollment.cohortId);
    if (cohort) {
      const currentActive = await Enrollment.countDocuments({
        cohortId: cohort._id,
        status: EnrollmentStatus.ACTIVE,
      });
      if (currentActive >= cohort.maxCapacity) {
        throw new AppError(`Cohort capacity reached (${currentActive}/${cohort.maxCapacity}). Cannot confirm enrollment.`, 400);
      }
    }

    // Check one active primary training rule for beneficiary
    const existingActive = await Enrollment.findOne({
      beneficiaryId: enrollment.beneficiaryId._id,
      status: EnrollmentStatus.ACTIVE,
      _id: { $ne: enrollment._id },
    });

    if (existingActive) {
      throw new AppError('This beneficiary is already actively enrolled in another ongoing training cohort. The organization policy allows only one active primary training.', 409);
    }

    // 1. Register Biometrics via BiometricService
    const identity = await BiometricService.registerTraineeBiometrics({
      beneficiaryId: enrollment.beneficiaryId._id.toString(),
      centreId: enrollment.centreId.toString(),
      deviceId: deviceId || '67c756200000000000000001',
      staffId: req.user?.staffRecordId || req.user!.userId,
      rawSample,
    });

    // 2. Transition enrollment to ACTIVE
    enrollment.status = EnrollmentStatus.ACTIVE;
    enrollment.enrollmentDate = new Date();
    enrollment.biometricRegistrationDetails = {
      registeredByStaffId: req.user?.staffRecordId as any,
      registeredAt: new Date(),
      deviceId: deviceId as any,
      biometricIdentifier: identity.biometricToken,
    };

    enrollment.statusHistory.push({
      status: EnrollmentStatus.ACTIVE,
      changedBy: req.user?.userId as any,
      changedAt: new Date(),
      reason: 'Biometric registration completed and enrollment confirmed',
    });

    await enrollment.save();

    // 3. Update Beneficiary profile with active enrollment
    await BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId._id, {
      activeEnrollmentId: enrollment._id,
    });

    // 4. Update Application status to ENROLLMENT_CONFIRMED
    await Application.findByIdAndUpdate(enrollment.applicationId, {
      status: ApplicationStatus.ENROLLMENT_CONFIRMED,
    });

    await AuditService.log({
      req,
      action: 'ENROLLMENT_CONFIRMED_ACTIVE',
      entityType: 'Enrollment',
      entityId: enrollment._id.toString(),
      centreId: enrollment.centreId.toString(),
      cohortId: enrollment.cohortId.toString(),
      afterState: { status: EnrollmentStatus.ACTIVE, biometricToken: identity.biometricToken },
    });

    // Send notification
    const beneficiaryUser = await BeneficiaryProfile.findById(enrollment.beneficiaryId._id).select('userId');
    if (beneficiaryUser?.userId) {
      await NotificationService.send({
        recipientUserId: beneficiaryUser.userId.toString(),
        title: 'Enrollment Confirmed!',
        message: 'Your biometric registration is complete and you are now an active trainee. Check your Timetable for upcoming sessions.',
        type: 'SUCCESS',
      });
    }

    sendSuccess(res, enrollment, 'Biometrics registered and trainee successfully enrolled into cohort');
  });

  // Dropping a Trainee (Non-destructive status transition)
  public static dropTrainee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) {
      throw new AppError('A reason is required when dropping a trainee.', 400);
    }

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    const prevStatus = enrollment.status;
    enrollment.status = EnrollmentStatus.DROPPED;
    enrollment.droppedDate = new Date();
    enrollment.dropReason = reason;

    enrollment.statusHistory.push({
      status: EnrollmentStatus.DROPPED,
      changedBy: req.user?.userId as any,
      changedAt: new Date(),
      reason,
    });

    await enrollment.save();

    // Clear active enrollment pointer on beneficiary profile
    await BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId, {
      $unset: { activeEnrollmentId: 1 },
    });

    await AuditService.log({
      req,
      action: 'TRAINEE_DROPPED',
      entityType: 'Enrollment',
      entityId: enrollment._id.toString(),
      centreId: enrollment.centreId.toString(),
      cohortId: enrollment.cohortId.toString(),
      beforeState: { status: prevStatus },
      afterState: { status: EnrollmentStatus.DROPPED, dropReason: reason },
      reason,
    });

    sendSuccess(res, enrollment, 'Trainee status updated to Dropped. Cohort slot is now available.');
  });

  // Trainee Withdrawal
  public static withdrawTrainee = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const enrollment = await Enrollment.findById(id);
    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    enrollment.status = EnrollmentStatus.WITHDRAWN;
    enrollment.statusReason = reason || 'Voluntary trainee withdrawal';
    enrollment.statusHistory.push({
      status: EnrollmentStatus.WITHDRAWN,
      changedBy: req.user?.userId as any,
      changedAt: new Date(),
      reason,
    });

    await enrollment.save();
    await BeneficiaryProfile.findByIdAndUpdate(enrollment.beneficiaryId, { $unset: { activeEnrollmentId: 1 } });

    sendSuccess(res, enrollment, 'Trainee withdrawn');
  });

  // Get active enrollment for current beneficiary (Portal)
  public static getMyActiveTraining = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    let beneficiaryId = req.user?.beneficiaryProfileId;
    if (!beneficiaryId) {
      const profile = await BeneficiaryProfile.findOne({ userId: req.user?.userId });
      beneficiaryId = profile?._id.toString();
    }

    if (!beneficiaryId) {
      throw new AppError('Beneficiary profile not found', 404);
    }

    const activeEnrollment = await Enrollment.findOne({
      beneficiaryId,
      status: { $in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.SELECTED, EnrollmentStatus.AWAITING_BIOMETRIC, EnrollmentStatus.COMPLETED] },
    })
      .populate('programId')
      .populate('cohortId')
      .populate('skillAreaId')
      .populate('centreId')
      .populate('certificateId')
      .sort({ updatedAt: -1 });

    const allHistory = await Enrollment.find({ beneficiaryId })
      .populate('programId')
      .populate('cohortId')
      .populate('skillAreaId')
      .populate('centreId')
      .populate('certificateId')
      .sort({ createdAt: -1 });

    sendSuccess(res, {
      active: activeEnrollment,
      history: allHistory,
    });
  });
}
