import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Public verification (No authentication required)
router.get('/verify/:code', CertificateController.verifyPublicCertificate);

// Protected Certificate Management
router.get('/', authenticate, CertificateController.getCertificates);
router.post('/issue', authenticate, requirePermission(PERMISSIONS.CERTIFICATES_ISSUE), CertificateController.issueCertificate);

export const certificateRoutes = router;
