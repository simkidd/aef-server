"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentRoutes = void 0;
const express_1 = require("express");
const assessment_controller_js_1 = require("../controllers/assessment.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_js_1.authenticate, assessment_controller_js_1.AssessmentController.getAssessments);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ASSESSMENTS_MANAGE), assessment_controller_js_1.AssessmentController.createAssessment);
router.get('/results', auth_middleware_js_1.authenticate, assessment_controller_js_1.AssessmentController.getAssessmentResults);
router.post('/results/batch', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.RESULTS_ENTER), assessment_controller_js_1.AssessmentController.enterResultsBatch);
exports.assessmentRoutes = router;
//# sourceMappingURL=assessment.routes.js.map