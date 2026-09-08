import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Beneficiary Portal
router.get('/my-training', authenticate, EnrollmentController.getMyActiveTraining);

// Admin & Registration Desk
router.get('/queue', authenticate, requirePermission(PERMISSIONS.ENROLLMENT_MANAGE), EnrollmentController.getEnrollmentQueue);
router.post('/:id/verify-physical', authenticate, requirePermission(PERMISSIONS.ENROLLMENT_MANAGE), EnrollmentController.verifyPhysical);
router.post('/:id/register-biometric', authenticate, requirePermission(PERMISSIONS.BIOMETRICS_REGISTER), EnrollmentController.registerBiometricAndEnroll);
router.post('/:id/drop', authenticate, requirePermission(PERMISSIONS.ENROLLMENT_MANAGE), EnrollmentController.dropTrainee);
router.post('/:id/withdraw', authenticate, requirePermission(PERMISSIONS.ENROLLMENT_MANAGE), EnrollmentController.withdrawTrainee);

export const enrollmentRoutes = router;
