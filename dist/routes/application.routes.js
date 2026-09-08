"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = require("express");
const application_controller_js_1 = require("../controllers/application.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Beneficiary Portal
router.get('/my', auth_middleware_js_1.authenticate, application_controller_js_1.ApplicationController.getMyApplications);
router.post('/apply', auth_middleware_js_1.authenticate, application_controller_js_1.ApplicationController.submitApplication);
// Admin Management
router.get('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.APPLICANTS_VIEW), application_controller_js_1.ApplicationController.getApplications);
router.put('/:id/status', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.APPLICANTS_REVIEW), application_controller_js_1.ApplicationController.updateApplicationStatus);
exports.applicationRoutes = router;
//# sourceMappingURL=application.routes.js.map