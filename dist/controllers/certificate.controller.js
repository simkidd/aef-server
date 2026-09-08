"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateController = void 0;
const certificate_model_js_1 = require("../models/certificate.model.js");
const certificate_service_js_1 = require("../services/certificate/certificate.service.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class CertificateController {
    // Get all issued certificates (Admin & Portal)
    static getCertificates = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { programId, centreId, cohortId, beneficiaryId, status, page, limit } = req.query;
        const filter = {};
        if (programId)
            filter.programId = programId;
        if (centreId)
            filter.centreId = centreId;
        if (cohortId)
            filter.cohortId = cohortId;
        if (beneficiaryId)
            filter.beneficiaryId = beneficiaryId;
        if (status)
            filter.status = status;
        // If called by beneficiary, restrict to own certificates
        if (req.user?.isBeneficiary && !req.user.isStaff && !req.user.roles.includes('SUPER_ADMIN')) {
            filter.beneficiaryId = req.user.beneficiaryProfileId;
        }
        const result = await (0, index_js_1.paginate)(certificate_model_js_1.Certificate, filter, {
            page: page,
            limit: limit,
            sort: { issueDate: -1 },
            populate: [
                { path: 'beneficiaryId' },
                { path: 'programId', select: 'title code organizerName' },
                { path: 'cohortId', select: 'name cohortCode' },
                { path: 'skillAreaId', select: 'name code category certificationType' },
                { path: 'centreId', select: 'name centreCode state' },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Certificates retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    // Issue Certificate
    static issueCertificate = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { enrollmentId, signatoryName, signatoryTitle, grade, score } = req.body;
        const cert = await certificate_service_js_1.CertificateService.issueCertificate({
            enrollmentId,
            signatoryName,
            signatoryTitle,
            grade,
            score,
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'CERTIFICATE_ISSUED',
            entityType: 'Certificate',
            entityId: cert._id.toString(),
            centreId: cert.centreId.toString(),
            cohortId: cert.cohortId.toString(),
            programId: cert.programId.toString(),
            reason: `Issued certificate ${cert.certificateNumber} for enrollment ${enrollmentId}`,
        });
        (0, index_js_1.sendSuccess)(res, cert, 'Certificate generated successfully', 201);
    });
    // Public Certificate Verification endpoint (accessible without login)
    static verifyPublicCertificate = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { code } = req.params;
        const cert = await certificate_service_js_1.CertificateService.verifyPublicCertificate(code);
        if (!cert) {
            throw new index_js_1.AppError('Certificate not found. The certificate number or verification hash is invalid.', 404);
        }
        (0, index_js_1.sendSuccess)(res, cert, 'Authentic Adele Empowerment Foundation Certificate verified.');
    });
}
exports.CertificateController = CertificateController;
//# sourceMappingURL=certificate.controller.js.map