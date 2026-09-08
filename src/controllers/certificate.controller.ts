import { Request, Response } from 'express';
import { Certificate } from '../models/certificate.model.js';
import { CertificateService } from '../services/certificate/certificate.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';

export class CertificateController {
  // Get all issued certificates (Admin & Portal)
  public static getCertificates = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { programId, centreId, cohortId, beneficiaryId, status, page, limit } = req.query;
    const filter: any = {};
    if (programId) filter.programId = programId;
    if (centreId) filter.centreId = centreId;
    if (cohortId) filter.cohortId = cohortId;
    if (beneficiaryId) filter.beneficiaryId = beneficiaryId;
    if (status) filter.status = status;

    // If called by beneficiary, restrict to own certificates
    if (req.user?.isBeneficiary && !req.user.isStaff && !req.user.roles.includes('SUPER_ADMIN')) {
      filter.beneficiaryId = req.user.beneficiaryProfileId;
    }

    const result = await paginate(Certificate, filter, {
      page: page as string,
      limit: limit as string,
      sort: { issueDate: -1 },
      populate: [
        { path: 'beneficiaryId' },
        { path: 'programId', select: 'title code organizerName' },
        { path: 'cohortId', select: 'name cohortCode' },
        { path: 'skillAreaId', select: 'name code category certificationType' },
        { path: 'centreId', select: 'name centreCode state' },
      ],
    });

    sendSuccess(res, result.docs, 'Certificates retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  // Issue Certificate
  public static issueCertificate = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { enrollmentId, signatoryName, signatoryTitle, grade, score } = req.body;
    const cert = await CertificateService.issueCertificate({
      enrollmentId,
      signatoryName,
      signatoryTitle,
      grade,
      score,
    });

    await AuditService.log({
      req,
      action: 'CERTIFICATE_ISSUED',
      entityType: 'Certificate',
      entityId: cert._id.toString(),
      centreId: cert.centreId.toString(),
      cohortId: cert.cohortId.toString(),
      programId: cert.programId.toString(),
      reason: `Issued certificate ${cert.certificateNumber} for enrollment ${enrollmentId}`,
    });

    sendSuccess(res, cert, 'Certificate generated successfully', 201);
  });

  // Public Certificate Verification endpoint (accessible without login)
  public static verifyPublicCertificate = asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const cert = await CertificateService.verifyPublicCertificate(code);

    if (!cert) {
      throw new AppError('Certificate not found. The certificate number or verification hash is invalid.', 404);
    }

    sendSuccess(res, cert, 'Authentic Adele Empowerment Foundation Certificate verified.');
  });
}
