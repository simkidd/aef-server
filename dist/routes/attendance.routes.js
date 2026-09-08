"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRoutes = void 0;
const express_1 = require("express");
const attendance_controller_js_1 = require("../controllers/attendance.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Beneficiary Portal History
router.get('/my-history', auth_middleware_js_1.authenticate, attendance_controller_js_1.AttendanceController.getMyAttendanceHistory);
router.get('/my', auth_middleware_js_1.authenticate, attendance_controller_js_1.AttendanceController.getMyAttendanceHistory);
// Admin / Staff Monitoring
router.get('/today-summary', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_VIEW), attendance_controller_js_1.AttendanceController.getTodaySummary);
router.get('/sheet', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_VIEW), attendance_controller_js_1.AttendanceController.getAttendanceSheet);
router.get('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_VIEW), attendance_controller_js_1.AttendanceController.getAttendanceSheet);
router.post('/corrections/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_EDIT), attendance_controller_js_1.AttendanceController.correctAttendance);
// Attendance Policy
router.get('/policies', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_VIEW), attendance_controller_js_1.AttendanceController.getPolicies);
router.put('/policies/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ATTENDANCE_POLICY_MANAGE), attendance_controller_js_1.AttendanceController.updatePolicy);
exports.attendanceRoutes = router;
//# sourceMappingURL=attendance.routes.js.map