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
exports.Enrollment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_js_1 = require("../constants/enums.js");
const EnrollmentStatusHistorySchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    changedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now },
    reason: { type: String },
});
const EnrollmentSchema = new mongoose_1.Schema({
    enrollmentCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    beneficiaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    applicationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    centreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre', required: true, index: true },
    status: {
        type: String,
        enum: Object.values(enums_js_1.EnrollmentStatus),
        default: enums_js_1.EnrollmentStatus.SELECTED,
        index: true,
    },
    statusReason: { type: String },
    verificationDetails: {
        verifiedByStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
        verifiedAt: { type: Date },
        documentsChecked: { type: Boolean, default: false },
        identityVerified: { type: Boolean, default: false },
        physicalNotes: { type: String },
    },
    biometricRegistrationDetails: {
        registeredByStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
        registeredAt: { type: Date },
        deviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BiometricDevice' },
        biometricIdentifier: { type: String },
    },
    enrollmentDate: { type: Date },
    completionDate: { type: Date },
    droppedDate: { type: Date },
    dropReason: { type: String },
    replacedByEnrollmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enrollment' },
    overallAttendanceRate: { type: Number, default: 0 },
    assessmentPassed: { type: Boolean },
    certificateIssued: { type: Boolean, default: false },
    certificateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Certificate' },
    statusHistory: [EnrollmentStatusHistorySchema],
}, { timestamps: true });
exports.Enrollment = mongoose_1.default.model('Enrollment', EnrollmentSchema);
//# sourceMappingURL=enrollment.model.js.map