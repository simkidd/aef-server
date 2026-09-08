"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programRoutes = void 0;
const express_1 = require("express");
const program_controller_js_1 = require("../controllers/program.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// ==========================================
// Public Routes (No authentication required)
// ==========================================
// Skill Areas (public discovery)
router.get('/skills/all', program_controller_js_1.ProgramController.getSkillAreas);
// Published Programs for Beneficiaries / Portal / Public Discovery
router.get('/published', program_controller_js_1.ProgramController.getPublishedPrograms);
router.get('/featured', program_controller_js_1.ProgramController.getFeaturedPrograms);
router.get('/published/:id', program_controller_js_1.ProgramController.getPublishedProgramById);
// ==========================================
// Protected / Admin Routes
// ==========================================
// Program Statistics
router.get('/stats', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_VIEW), program_controller_js_1.ProgramController.getProgramStats);
// Skill Area Management
router.post('/skills', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.SKILLS_MANAGE), program_controller_js_1.ProgramController.createSkillArea);
router.put('/skills/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.SKILLS_MANAGE), program_controller_js_1.ProgramController.updateSkillArea);
// Program Management
router.get('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_VIEW), program_controller_js_1.ProgramController.getPrograms);
router.get('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_VIEW), program_controller_js_1.ProgramController.getProgramById);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_MANAGE), program_controller_js_1.ProgramController.createProgram);
router.put('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_MANAGE), program_controller_js_1.ProgramController.updateProgram);
router.delete('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PROGRAMS_MANAGE), program_controller_js_1.ProgramController.deleteProgram);
exports.programRoutes = router;
//# sourceMappingURL=program.routes.js.map