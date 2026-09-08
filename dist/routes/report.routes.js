"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRoutes = void 0;
const express_1 = require("express");
const report_controller_js_1 = require("../controllers/report.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
router.get('/overview', auth_middleware_js_1.authenticate, report_controller_js_1.ReportController.getDashboardOverview);
router.get('/impact', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.REPORTS_VIEW), report_controller_js_1.ReportController.getImpactReports);
exports.reportRoutes = router;
//# sourceMappingURL=report.routes.js.map