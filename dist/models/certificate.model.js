"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CertificateSchema = new mongoose_1.Schema({
    certificateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    verificationCode: { type: String, required: true, unique: true, index: true },
    beneficiaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    enrollmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enrollment', required: true, unique: true, index: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    issueDate: { type: Date, required: true, default: Date.now },
    overallAttendanceRate: { type: Number, required: true },
    overallAssessmentScore: { type: Number },
    grade: { type: String, default: 'Pass' },
    authorizedSignatory: {
        name: { type: String, required: true, default: 'Hon. Adele Executive Director' },
        title: { type: String, required: true, default: 'Executive Director, AEF' },
        signatureUrl: { type: String },
    },
    issuingOrganization: { type: String, required: true, default: 'Adele Empowerment Foundation' },
    qrCodeUrl: { type: String },
    status: {
        type: String,
        enum: ['Issued', 'Revoked', 'Suspended'],
        default: 'Issued',
        index: true,
    },
    revocationReason: { type: String },
}, { timestamps: true });
exports.Certificate = mongoose_1.default.model('Certificate', CertificateSchema);
//# sourceMappingURL=certificate.model.js.map