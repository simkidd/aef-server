import { Response } from 'express';
import { Application } from '../models/application.model.js';
import { BeneficiaryProfile } from '../models/beneficiaryProfile.model.js';
import { Enrollment } from '../models/enrollment.model.js';
import { Cohort } from '../models/cohort.model.js';
import { Program } from '../models/program.model.js';
import { ApplicationStatus, EnrollmentStatus } from '../constants/enums.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { NotificationService } from '../services/notification/notification.service.js';
import { asyncHandler, sendSuccess, AppError, paginate, sendApplicationStatusEmail } from '../utils/index.js';

export class ApplicationController {
  public static getApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { programId, skillAreaId, centreId, status, search, page, limit } = req.query;
    const filter: any = {};
    if (programId) filter.programId = programId;
    if (skillAreaId) filter.preferredSkillAreaId = skillAreaId;
    if (centreId) filter.preferredCentreId = centreId;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { applicationNumber: { $regex: search, $options: 'i' } },
        { statementOfPurpose: { $regex: search, $options: 'i' } },
      ];
    }

    const result = await paginate(Application, filter, {
      page: page as string,
      limit: limit as string,
      sort: { submittedAt: -1 },
      populate: [
        { path: 'beneficiaryId' },
        { path: 'programId', select: 'title code organizerName' },
        { path: 'preferredSkillAreaId', select: 'name code' },
        { path: 'preferredCentreId', select: 'name centreCode state lga' },
        { path: 'reviewedBy', select: 'firstName lastName' },
      ],
    });

    sendSuccess(res, result.docs, 'Applications retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  public static getMyApplications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!req.user.beneficiaryProfileId) {
      // Try finding profile by userId
      const profile = await BeneficiaryProfile.findOne({ userId: req.user.userId });
      if (!profile) {
        throw new AppError('Beneficiary profile not found.', 404);
      }
      req.user.beneficiaryProfileId = profile._id.toString();
    }

    const applications = await Application.find({ beneficiaryId: req.user.beneficiaryProfileId })
      .populate({
        path: 'beneficiaryId',
        select: 'firstName lastName highestEducation phone beneficiaryCode',
      })
      .populate('programId', 'title code organizerName organizerType')
      .populate('preferredSkillAreaId', 'name code category')
      .populate('preferredCentreId', 'name centreCode address state lga')
      .sort({ submittedAt: -1 });

    sendSuccess(res, applications);
  });

  public static submitApplication = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { programId, preferredSkillAreaId, preferredCentreId, statementOfPurpose, previousExperience } = req.body;

    // Locate beneficiary profile
    let profile = await BeneficiaryProfile.findOne({ userId: req.user?.userId });
    if (!profile && req.user?.beneficiaryProfileId) {
      profile = await BeneficiaryProfile.findById(req.user.beneficiaryProfileId);
    }

    if (!profile) {
      throw new AppError('Please complete your beneficiary profile before applying.', 400);
    }

    // Check if already applied to this program
    const existing = await Application.findOne({
      beneficiaryId: profile._id,
      programId,
      status: { $nin: [ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN, ApplicationStatus.EXPIRED] },
    });

    if (existing) {
      throw new AppError('You have already submitted an active application for this program.', 409);
    }

    const count = await Application.countDocuments();
    const appNumber = `AEF-APP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const application = await Application.create({
      applicationNumber: appNumber,
      beneficiaryId: profile._id,
      programId,
      preferredSkillAreaId,
      preferredCentreId,
      status: ApplicationStatus.SUBMITTED,
      statementOfPurpose,
      previousExperience,
      submittedAt: new Date(),
      statusHistory: [
        {
          status: ApplicationStatus.SUBMITTED,
          changedBy: req.user?.userId,
          changedAt: new Date(),
          reason: 'Application submitted online',
        },
      ],
    });

    await NotificationService.send({
      recipientUserId: req.user!.userId,
      title: 'Application Received',
      message: `Your application (${appNumber}) has been received and is under review.`,
      type: 'SUCCESS',
    });

    sendSuccess(res, application, 'Application submitted successfully', 201);
  });

  public static updateApplicationStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status, reason, assignedCohortId } = req.body;

    const application = await Application.findById(id).populate('beneficiaryId');
    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const previousStatus = application.status;
    application.status = status;
    application.statusReason = reason;
    application.reviewedBy = req.user?.staffRecordId as any;
    application.reviewedAt = new Date();

    application.statusHistory.push({
      status,
      changedBy: req.user?.userId as any,
      changedAt: new Date(),
      reason,
    });

    await application.save();

    // If Selected, create a pending Enrollment entry in the Enrollment Queue!
    if (status === ApplicationStatus.SELECTED) {
      const cohort = assignedCohortId
        ? await Cohort.findById(assignedCohortId)
        : await Cohort.findOne({
            programId: application.programId,
            centreId: application.preferredCentreId,
            status: { $in: ['Upcoming', 'Enrolling'] },
          });

      if (cohort) {
        const count = await Enrollment.countDocuments();
        const enrollmentCode = `AEF-ENR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

        await Enrollment.findOneAndUpdate(
          { applicationId: application._id },
          {
            enrollmentCode,
            beneficiaryId: application.beneficiaryId._id,
            applicationId: application._id,
            programId: application.programId,
            cohortId: cohort._id,
            skillAreaId: application.preferredSkillAreaId,
            centreId: cohort.centreId,
            status: EnrollmentStatus.SELECTED,
            statusHistory: [
              {
                status: EnrollmentStatus.SELECTED,
                changedBy: req.user?.userId,
                changedAt: new Date(),
                reason: 'Candidate selected for physical verification & biometric registration',
              },
            ],
          },
          { upsert: true, new: true }
        );
      }
    }

    await AuditService.log({
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
    const beneficiaryProfile = await BeneficiaryProfile.findById(application.beneficiaryId);
    if (beneficiaryProfile?.userId) {
      await NotificationService.send({
        recipientUserId: beneficiaryProfile.userId.toString(),
        title: `Application Status: ${status}`,
        message:
          status === ApplicationStatus.SELECTED
            ? `Congratulations! You have been selected. Please proceed to your assigned training centre for physical verification and biometric registration.`
            : `Your application status has been updated to ${status}.`,
        type: status === ApplicationStatus.SELECTED ? 'SUCCESS' : 'INFO',
      });
    }

    if (beneficiaryProfile?.email) {
      const program = await Program.findById(application.programId).select('title');
      sendApplicationStatusEmail(beneficiaryProfile.email, {
        name: `${beneficiaryProfile.firstName} ${beneficiaryProfile.lastName}`,
        applicationNumber: application.applicationNumber,
        programTitle: program?.title || 'Adele Empowerment Program',
        status,
        details: reason,
      }).catch(() => {});
    }

    sendSuccess(res, application, `Application updated to ${status}`);
  });
}
