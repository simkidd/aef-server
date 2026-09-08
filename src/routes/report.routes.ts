import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

router.get('/overview', authenticate, ReportController.getDashboardOverview);
router.get('/impact', authenticate, requirePermission(PERMISSIONS.REPORTS_VIEW), ReportController.getImpactReports);

export const reportRoutes = router;
