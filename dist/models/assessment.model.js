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
exports.AssessmentResult = exports.Assessment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AssessmentSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    programId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    skillAreaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'SkillArea', required: true, index: true },
    type: {
        type: String,
        enum: ['Continuous Assessment', 'Mid-Term Practical', 'Final Practical', 'Theory Exam', 'Project Work'],
        required: true,
        index: true,
    },
    maxScore: { type: Number, required: true, default: 100 },
    passingScore: { type: Number, required: true, default: 60 },
    weightagePercent: { type: Number, required: true, default: 50 },
    scheduledDate: { type: Date, required: true },
    examinerStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
    instructions: { type: String },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
exports.Assessment = mongoose_1.default.model('Assessment', AssessmentSchema);
const AssessmentResultSchema = new mongoose_1.Schema({
    assessmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
    beneficiaryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BeneficiaryProfile', required: true, index: true },
    enrollmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
    cohortId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cohort', required: true, index: true },
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    grade: { type: String, enum: ['Distinction', 'Credit', 'Pass', 'Fail'], default: 'Pass' },
    examinerStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff', required: true },
    remarks: { type: String },
    attemptNumber: { type: Number, default: 1 },
    gradedAt: { type: Date, default: Date.now },
}, { timestamps: true });
AssessmentResultSchema.index({ assessmentId: 1, beneficiaryId: 1, attemptNumber: 1 }, { unique: true });
exports.AssessmentResult = mongoose_1.default.model('AssessmentResult', AssessmentResultSchema);
//# sourceMappingURL=assessment.model.js.map