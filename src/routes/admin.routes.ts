import { Router } from "express";
import { AdminController } from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = Router();

// Users & Account permissions
router.get(
  "/users",
  authenticate,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  AdminController.getUsers,
);
router.get(
  "/users/stats",
  authenticate,
  requirePermission(PERMISSIONS.USERS_MANAGE),
  AdminController.getUserStats,
);
router.put(
  "/users/:id/roles-scopes",
  authenticate,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  AdminController.updateUserRolesAndScopes,
);

// Roles & Permissions matrix
router.get(
  "/roles",
  authenticate,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  AdminController.getRoles,
);
router.put(
  "/roles/:id",
  authenticate,
  requirePermission(PERMISSIONS.ROLES_MANAGE),
  AdminController.updateRolePermissions,
);

// Audit Logs
router.get(
  "/audit-logs",
  authenticate,
  requirePermission(PERMISSIONS.AUDIT_VIEW),
  AdminController.getAuditLogs,
);

// System Settings
router.get("/settings", authenticate, AdminController.getSettings);
router.post(
  "/settings",
  authenticate,
  requirePermission(PERMISSIONS.SETTINGS_MANAGE),
  AdminController.updateSetting,
);

export const adminRoutes = router;
