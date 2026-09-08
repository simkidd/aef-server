import { Router } from 'express';
import { CentreController } from '../controllers/centre.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Training Centres
router.get('/', CentreController.getCentres);
router.get('/:id', CentreController.getCentreById);
router.post('/', authenticate, requirePermission(PERMISSIONS.CENTRES_MANAGE), CentreController.createCentre);
router.put('/:id', authenticate, requirePermission(PERMISSIONS.CENTRES_MANAGE), CentreController.updateCentre);

// Rooms & Facilities
router.get('/facilities/rooms', CentreController.getRooms);
router.post('/facilities/rooms', authenticate, requirePermission(PERMISSIONS.FACILITIES_MANAGE), CentreController.createRoom);

// Assets
router.get('/assets/all', authenticate, CentreController.getAssets);
router.post('/assets', authenticate, requirePermission(PERMISSIONS.ASSETS_MANAGE), CentreController.createAsset);

// Documents
router.get('/documents/all', authenticate, CentreController.getDocuments);
router.post('/documents', authenticate, requirePermission(PERMISSIONS.DOCUMENTS_MANAGE), CentreController.createDocument);

export const centreRoutes = router;
