"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_js_1 = require("../controllers/admin.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Users & Account permissions
router.get("/users", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.USERS_MANAGE), admin_controller_js_1.AdminController.getUsers);
router.get("/users/stats", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.USERS_MANAGE), admin_controller_js_1.AdminController.getUserStats);
router.put("/users/:id/roles-scopes", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ROLES_MANAGE), admin_controller_js_1.AdminController.updateUserRolesAndScopes);
// Roles & Permissions matrix
router.get("/roles", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ROLES_MANAGE), admin_controller_js_1.AdminController.getRoles);
router.put("/roles/:id", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ROLES_MANAGE), admin_controller_js_1.AdminController.updateRolePermissions);
// Audit Logs
router.get("/audit-logs", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.AUDIT_VIEW), admin_controller_js_1.AdminController.getAuditLogs);
// System Settings
router.get("/settings", auth_middleware_js_1.authenticate, admin_controller_js_1.AdminController.getSettings);
router.post("/settings", auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.SETTINGS_MANAGE), admin_controller_js_1.AdminController.updateSetting);
exports.adminRoutes = router;
//# sourceMappingURL=admin.routes.js.map