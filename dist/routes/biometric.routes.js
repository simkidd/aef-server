"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.biometricRoutes = void 0;
const express_1 = require("express");
const biometric_controller_js_1 = require("../controllers/biometric.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Device Management
router.get('/devices', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.DEVICES_MANAGE), biometric_controller_js_1.BiometricController.getDevices);
router.post('/devices', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.DEVICES_MANAGE), biometric_controller_js_1.BiometricController.createDevice);
// Real Scanner Webhook / Simulator Ingestion Endpoint
router.post('/scan', biometric_controller_js_1.BiometricController.handleScanWebhook);
// Raw Event Logs
router.get('/events', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.BIOMETRICS_VIEW), biometric_controller_js_1.BiometricController.getEvents);
exports.biometricRoutes = router;
//# sourceMappingURL=biometric.routes.js.map