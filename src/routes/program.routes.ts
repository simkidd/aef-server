import { Router } from 'express';
import { ProgramController } from '../controllers/program.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// ==========================================
// Public Routes (No authentication required)
// ==========================================
// Skill Areas (public discovery)
router.get('/skills/all', ProgramController.getSkillAreas);

// Published Programs for Beneficiaries / Portal / Public Discovery
router.get('/published', ProgramController.getPublishedPrograms);
router.get('/featured', ProgramController.getFeaturedPrograms);
router.get('/published/:id', ProgramController.getPublishedProgramById);

// ==========================================
// Protected / Admin Routes
// ==========================================
// Program Statistics
router.get('/stats', authenticate, requirePermission(PERMISSIONS.PROGRAMS_VIEW), ProgramController.getProgramStats);

// Skill Area Management
router.post('/skills', authenticate, requirePermission(PERMISSIONS.SKILLS_MANAGE), ProgramController.createSkillArea);
router.put('/skills/:id', authenticate, requirePermission(PERMISSIONS.SKILLS_MANAGE), ProgramController.updateSkillArea);

// Program Management
router.get('/', authenticate, requirePermission(PERMISSIONS.PROGRAMS_VIEW), ProgramController.getPrograms);
router.get('/:id', authenticate, requirePermission(PERMISSIONS.PROGRAMS_VIEW), ProgramController.getProgramById);
router.post('/', authenticate, requirePermission(PERMISSIONS.PROGRAMS_MANAGE), ProgramController.createProgram);
router.put('/:id', authenticate, requirePermission(PERMISSIONS.PROGRAMS_MANAGE), ProgramController.updateProgram);
router.delete('/:id', authenticate, requirePermission(PERMISSIONS.PROGRAMS_MANAGE), ProgramController.deleteProgram);

export const programRoutes = router;
