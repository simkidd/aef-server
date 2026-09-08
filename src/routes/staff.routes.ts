import { Router } from 'express';
import { StaffController } from '../controllers/staff.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Staff
router.get('/', authenticate, requirePermission(PERMISSIONS.STAFF_VIEW), StaffController.getStaffList);
router.post('/', authenticate, requirePermission(PERMISSIONS.STAFF_MANAGE), StaffController.createStaff);
router.put('/:id', authenticate, requirePermission(PERMISSIONS.STAFF_MANAGE), StaffController.updateStaff);
router.post('/:staffId/provision-account', authenticate, requirePermission(PERMISSIONS.USERS_MANAGE), StaffController.createStaffUserAccount);

// Volunteers
router.get('/volunteers/all', authenticate, StaffController.getVolunteers);
router.post('/volunteers', authenticate, requirePermission(PERMISSIONS.VOLUNTEERS_MANAGE), StaffController.createVolunteer);

// Partners
router.get('/partners/all', authenticate, StaffController.getPartners);
router.post('/partners', authenticate, requirePermission(PERMISSIONS.PARTNERS_MANAGE), StaffController.createPartner);

export const staffRoutes = router;
