"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentRoutes = void 0;
const express_1 = require("express");
const enrollment_controller_js_1 = require("../controllers/enrollment.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Beneficiary Portal
router.get('/my-training', auth_middleware_js_1.authenticate, enrollment_controller_js_1.EnrollmentController.getMyActiveTraining);
// Admin & Registration Desk
router.get('/queue', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ENROLLMENT_MANAGE), enrollment_controller_js_1.EnrollmentController.getEnrollmentQueue);
router.post('/:id/verify-physical', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ENROLLMENT_MANAGE), enrollment_controller_js_1.EnrollmentController.verifyPhysical);
router.post('/:id/register-biometric', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.BIOMETRICS_REGISTER), enrollment_controller_js_1.EnrollmentController.registerBiometricAndEnroll);
router.post('/:id/drop', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ENROLLMENT_MANAGE), enrollment_controller_js_1.EnrollmentController.dropTrainee);
router.post('/:id/withdraw', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ENROLLMENT_MANAGE), enrollment_controller_js_1.EnrollmentController.withdrawTrainee);
exports.enrollmentRoutes = router;
//# sourceMappingURL=enrollment.routes.js.map