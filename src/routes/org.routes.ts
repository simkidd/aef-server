import { Router } from 'express';
import { OrgController } from '../controllers/org.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

router.get('/info', OrgController.getOrgInfo);
router.put('/info', authenticate, requirePermission(PERMISSIONS.ORG_MANAGE), OrgController.updateOrgInfo);

export const orgRoutes = router;
