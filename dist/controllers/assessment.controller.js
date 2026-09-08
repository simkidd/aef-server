"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const assessment_model_js_1 = require("../models/assessment.model.js");
const enrollment_model_js_1 = require("../models/enrollment.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class AssessmentController {
    // Assessments
    static getAssessments = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { programId, cohortId, skillAreaId } = req.query;
        const filter = {};
        if (programId)
            filter.programId = programId;
        if (cohortId)
            filter.cohortId = cohortId;
        if (skillAreaId)
            filter.skillAreaId = skillAreaId;
        const assessments = await assessment_model_js_1.Assessment.find(filter)
            .populate('programId', 'title code')
            .populate('cohortId', 'name cohortCode')
            .populate('skillAreaId', 'name code')
            .populate('examinerStaffId', 'firstName lastName')
            .sort({ scheduledDate: -1 });
        (0, index_js_1.sendSuccess)(res, assessments);
    });
    static createAssessment = (0, index_js_1.asyncHandler)(async (req, res) => {
        const assessment = await assessment_model_js_1.Assessment.create({
            ...req.body,
            examinerStaffId: req.user?.staffRecordId || req.user?.userId,
        });
        (0, index_js_1.sendSuccess)(res, assessment, 'Assessment created', 201);
    });
    // Results & Gradebook
    static getAssessmentResults = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { assessmentId, cohortId, beneficiaryId } = req.query;
        const filter = {};
        if (assessmentId)
            filter.assessmentId = assessmentId;
        if (cohortId)
            filter.cohortId = cohortId;
        if (beneficiaryId)
            filter.beneficiaryId = beneficiaryId;
        const results = await assessment_model_js_1.AssessmentResult.find(filter)
            .populate('assessmentId', 'title type maxScore passingScore')
            .populate('beneficiaryId', 'firstName lastName beneficiaryCode')
            .populate('cohortId', 'name cohortCode')
            .populate('examinerStaffId', 'firstName lastName')
            .sort({ gradedAt: -1 });
        (0, index_js_1.sendSuccess)(res, results);
    });
    static enterResultsBatch = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { assessmentId, results } = req.body;
        const assessment = await assessment_model_js_1.Assessment.findById(assessmentId);
        if (!assessment) {
            throw new index_js_1.AppError('Assessment not found', 404);
        }
        const savedResults = [];
        for (const item of results) {
            const percentage = Math.round((item.score / assessment.maxScore) * 100 * 10) / 10;
            const passed = item.score >= assessment.passingScore;
            let grade = 'Fail';
            if (percentage >= 85)
                grade = 'Distinction';
            else if (percentage >= 70)
                grade = 'Credit';
            else if (percentage >= 50)
                grade = 'Pass';
            const resultDoc = await assessment_model_js_1.AssessmentResult.findOneAndUpdate({ assessmentId, beneficiaryId: item.beneficiaryId, attemptNumber: item.attemptNumber || 1 }, {
                enrollmentId: item.enrollmentId,
                cohortId: assessment.cohortId,
                score: item.score,
                percentage,
                passed,
                grade,
                examinerStaffId: req.user?.staffRecordId || req.user.userId,
                remarks: item.remarks,
                gradedAt: new Date(),
            }, { upsert: true, new: true });
            // Update enrollment assessment status
            if (item.enrollmentId) {
                await enrollment_model_js_1.Enrollment.findByIdAndUpdate(item.enrollmentId, {
                    assessmentPassed: passed,
                });
            }
            savedResults.push(resultDoc);
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ASSESSMENT_RESULTS_RECORDED',
            entityType: 'Assessment',
            entityId: assessment._id.toString(),
            cohortId: assessment.cohortId.toString(),
            programId: assessment.programId.toString(),
            reason: `Graded ${savedResults.length} trainees for assessment: ${assessment.title}`,
        });
        (0, index_js_1.sendSuccess)(res, savedResults, `Entered grades for ${savedResults.length} trainees`);
    });
}
exports.AssessmentController = AssessmentController;
//# sourceMappingURL=assessment.controller.js.map