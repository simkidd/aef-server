import { Router } from 'express';
import { BiometricController } from '../controllers/biometric.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Device Management
router.get('/devices', authenticate, requirePermission(PERMISSIONS.DEVICES_MANAGE), BiometricController.getDevices);
router.post('/devices', authenticate, requirePermission(PERMISSIONS.DEVICES_MANAGE), BiometricController.createDevice);

// Real Scanner Webhook / Simulator Ingestion Endpoint
router.post('/scan', BiometricController.handleScanWebhook);

// Raw Event Logs
router.get('/events', authenticate, requirePermission(PERMISSIONS.BIOMETRICS_VIEW), BiometricController.getEvents);

export const biometricRoutes = router;
