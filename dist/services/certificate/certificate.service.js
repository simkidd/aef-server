"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const certificate_model_js_1 = require("../../models/certificate.model.js");
const enrollment_model_js_1 = require("../../models/enrollment.model.js");
const enums_js_1 = require("../../constants/enums.js");
class CertificateService {
    /**
     * Generate verifiable Certificate for an eligible completed trainee
     */
    static async issueCertificate(params) {
        const enrollment = await enrollment_model_js_1.Enrollment.findById(params.enrollmentId)
            .populate('beneficiaryId')
            .populate('programId')
            .populate('cohortId')
            .populate('skillAreaId')
            .populate('centreId');
        if (!enrollment) {
            throw new Error('Enrollment record not found.');
        }
        // Check if certificate already exists
        const existing = await certificate_model_js_1.Certificate.findOne({ enrollmentId: params.enrollmentId });
        if (existing) {
            return existing;
        }
        const program = enrollment.programId;
        const skill = enrollment.skillAreaId;
        const centre = enrollment.centreId;
        const certCode = `AEF-${new Date().getFullYear()}-${skill?.code || 'GEN'}-${Math.floor(10000 + Math.random() * 90000)}`;
        const verificationCode = crypto_1.default.randomBytes(16).toString('hex');
        const cert = await certificate_model_js_1.Certificate.create({
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
        await enrollment_model_js_1.Enrollment.findByIdAndUpdate(enrollment._id, {
            status: enums_js_1.EnrollmentStatus.COMPLETED,
            certificateIssued: true,
            certificateId: cert._id,
            completionDate: new Date(),
        });
        return cert;
    }
    /**
     * Verify a certificate by its public verification hash
     */
    static async verifyPublicCertificate(verificationCode) {
        const cert = await certificate_model_js_1.Certificate.findOne({ verificationCode })
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
exports.CertificateService = CertificateService;
//# sourceMappingURL=certificate.service.js.map