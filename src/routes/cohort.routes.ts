import { Router } from 'express';
import { CohortController } from '../controllers/cohort.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = Router();

// Timetable Sessions & Schedule (Must be defined BEFORE /:id)
router.get('/timetable', CohortController.getSessions);
router.get('/schedule/sessions', CohortController.getSessions);
router.post('/schedule/sessions/:id/cancel', authenticate, requirePermission(PERMISSIONS.TIMETABLE_MANAGE), CohortController.cancelSession);

// Timetable Multi-Slot Drafting & Publishing
router.post('/:id/timetable/draft', authenticate, requirePermission(PERMISSIONS.TIMETABLE_MANAGE), CohortController.saveTimetableDraft);
router.post('/:id/timetable/publish', authenticate, requirePermission(PERMISSIONS.TIMETABLE_MANAGE), CohortController.publishTimetable);
router.post('/:id/timetable/unpublish', authenticate, requirePermission(PERMISSIONS.TIMETABLE_MANAGE), CohortController.unpublishTimetable);

// Calendar Events (Holidays, Centre Closures)
router.get('/calendar/events', CohortController.getCalendarEvents);
router.post('/calendar/events', authenticate, requirePermission(PERMISSIONS.CALENDAR_MANAGE), CohortController.createCalendarEvent);

// Cohorts CRUD
router.get('/', CohortController.getCohorts);
router.get('/:id', CohortController.getCohortById);
router.post('/', authenticate, requirePermission(PERMISSIONS.COHORTS_MANAGE), CohortController.createCohort);
router.put('/:id', authenticate, requirePermission(PERMISSIONS.COHORTS_MANAGE), CohortController.updateCohort);

export const cohortRoutes = router;
