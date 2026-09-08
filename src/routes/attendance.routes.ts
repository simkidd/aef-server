import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Beneficiary Portal History
router.get('/my-history', authenticate, AttendanceController.getMyAttendanceHistory);
router.get('/my', authenticate, AttendanceController.getMyAttendanceHistory);

// Admin / Staff Monitoring
router.get('/today-summary', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_VIEW), AttendanceController.getTodaySummary);
router.get('/sheet', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_VIEW), AttendanceController.getAttendanceSheet);
router.get('/', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_VIEW), AttendanceController.getAttendanceSheet);
router.post('/corrections/:id', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_EDIT), AttendanceController.correctAttendance);

// Attendance Policy
router.get('/policies', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_VIEW), AttendanceController.getPolicies);
router.put('/policies/:id', authenticate, requirePermission(PERMISSIONS.ATTENDANCE_POLICY_MANAGE), AttendanceController.updatePolicy);

export const attendanceRoutes = router;
