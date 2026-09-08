import crypto from 'crypto';
import { Certificate } from '../../models/certificate.model.js';
import { Enrollment } from '../../models/enrollment.model.js';
import { BeneficiaryProfile } from '../../models/beneficiaryProfile.model.js';
import { Program, SkillArea } from '../../models/program.model.js';
import { Cohort } from '../../models/cohort.model.js';
import { TrainingCentre } from '../../models/trainingCentre.model.js';
import { EnrollmentStatus } from '../../constants/enums.js';

export class CertificateService {
  /**
   * Generate verifiable Certificate for an eligible completed trainee
   */
  public static async issueCertificate(params: {
    enrollmentId: string;
    signatoryName?: string;
    signatoryTitle?: string;
    grade?: string;
    score?: number;
  }) {
    const enrollment = await Enrollment.findById(params.enrollmentId)
      .populate('beneficiaryId')
      .populate('programId')
      .populate('cohortId')
      .populate('skillAreaId')
      .populate('centreId');

    if (!enrollment) {
      throw new Error('Enrollment record not found.');
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ enrollmentId: params.enrollmentId });
    if (existing) {
      return existing;
    }

    const program = enrollment.programId as any;
    const skill = enrollment.skillAreaId as any;
    const centre = enrollment.centreId as any;

    const certCode = `AEF-${new Date().getFullYear()}-${skill?.code || 'GEN'}-${Math.floor(10000 + Math.random() * 90000)}`;
    const verificationCode = crypto.randomBytes(16).toString('hex');

    const cert = await Certificate.create({
      certificateNumber: certCode,
      verificationCode,
      beneficiaryId: enrollment.beneficiaryId,
      enrollmentId: enrollment._id,
      programId: enrollment.programId,
      cohortId: enrollment.cohortId,
      skillAreaId: enrollment.skillAreaId,
      centreId: enrollment.centreId,
      issueDate: new Date(),
      overallAttendanceRate: enrollment.overallAttendanceRate || 85,
      overallAssessmentScore: params.score || 80,
      grade: params.grade || 'Pass',
      authorizedSignatory: {
        name: params.signatoryName || 'Hon. Adele Executive Director',
        title: params.signatoryTitle || 'Executive Director, AEF',
      },
      issuingOrganization: 'Adele Empowerment Foundation',
      qrCodeUrl: `/verify/${verificationCode}`,
      status: 'Issued',
    });

    // Mark enrollment completed & attach certificate
    await Enrollment.findByIdAndUpdate(enrollment._id, {
      status: EnrollmentStatus.COMPLETED,
      certificateIssued: true,
      certificateId: cert._id,
      completionDate: new Date(),
    });

    return cert;
  }

  /**
   * Verify a certificate by its public verification hash
   */
  public static async verifyPublicCertificate(verificationCode: string) {
    const cert = await Certificate.findOne({ verificationCode })
      .populate('beneficiaryId', 'firstName lastName gender beneficiaryCode')
      .populate('programId', 'title code organizerName deliveryRole')
      .populate('skillAreaId', 'name code category certificationType')
      .populate('centreId', 'name centreCode state lga')
      .lean();

    if (!cert) {
      return null;
    }

    return cert;
  }
}
