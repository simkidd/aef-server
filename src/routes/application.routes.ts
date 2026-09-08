import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Beneficiary Portal
router.get('/my', authenticate, ApplicationController.getMyApplications);
router.post('/apply', authenticate, ApplicationController.submitApplication);

// Admin Management
router.get('/', authenticate, requirePermission(PERMISSIONS.APPLICANTS_VIEW), ApplicationController.getApplications);
router.put('/:id/status', authenticate, requirePermission(PERMISSIONS.APPLICANTS_REVIEW), ApplicationController.updateApplicationStatus);

export const applicationRoutes = router;
