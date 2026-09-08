"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cohortRoutes = void 0;
const express_1 = require("express");
const cohort_controller_js_1 = require("../controllers/cohort.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Timetable Sessions & Schedule (Must be defined BEFORE /:id)
router.get('/timetable', cohort_controller_js_1.CohortController.getSessions);
router.get('/schedule/sessions', cohort_controller_js_1.CohortController.getSessions);
router.post('/schedule/sessions/:id/cancel', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.TIMETABLE_MANAGE), cohort_controller_js_1.CohortController.cancelSession);
// Timetable Multi-Slot Drafting & Publishing
router.post('/:id/timetable/draft', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.TIMETABLE_MANAGE), cohort_controller_js_1.CohortController.saveTimetableDraft);
router.post('/:id/timetable/publish', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.TIMETABLE_MANAGE), cohort_controller_js_1.CohortController.publishTimetable);
router.post('/:id/timetable/unpublish', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.TIMETABLE_MANAGE), cohort_controller_js_1.CohortController.unpublishTimetable);
// Calendar Events (Holidays, Centre Closures)
router.get('/calendar/events', cohort_controller_js_1.CohortController.getCalendarEvents);
router.post('/calendar/events', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.CALENDAR_MANAGE), cohort_controller_js_1.CohortController.createCalendarEvent);
// Cohorts CRUD
router.get('/', cohort_controller_js_1.CohortController.getCohorts);
router.get('/:id', cohort_controller_js_1.CohortController.getCohortById);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.COHORTS_MANAGE), cohort_controller_js_1.CohortController.createCohort);
router.put('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.COHORTS_MANAGE), cohort_controller_js_1.CohortController.updateCohort);
exports.cohortRoutes = router;
//# sourceMappingURL=cohort.routes.js.map