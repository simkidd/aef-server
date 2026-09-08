"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffRoutes = void 0;
const express_1 = require("express");
const staff_controller_js_1 = require("../controllers/staff.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Staff
router.get('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.STAFF_VIEW), staff_controller_js_1.StaffController.getStaffList);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.STAFF_MANAGE), staff_controller_js_1.StaffController.createStaff);
router.put('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.STAFF_MANAGE), staff_controller_js_1.StaffController.updateStaff);
router.post('/:staffId/provision-account', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.USERS_MANAGE), staff_controller_js_1.StaffController.createStaffUserAccount);
// Volunteers
router.get('/volunteers/all', auth_middleware_js_1.authenticate, staff_controller_js_1.StaffController.getVolunteers);
router.post('/volunteers', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.VOLUNTEERS_MANAGE), staff_controller_js_1.StaffController.createVolunteer);
// Partners
router.get('/partners/all', auth_middleware_js_1.authenticate, staff_controller_js_1.StaffController.getPartners);
router.post('/partners', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.PARTNERS_MANAGE), staff_controller_js_1.StaffController.createPartner);
exports.staffRoutes = router;
//# sourceMappingURL=staff.routes.js.map