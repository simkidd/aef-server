"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRoutes = void 0;
const express_1 = require("express");
const certificate_controller_js_1 = require("../controllers/certificate.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Public verification (No authentication required)
router.get('/verify/:code', certificate_controller_js_1.CertificateController.verifyPublicCertificate);
// Protected Certificate Management
router.get('/', auth_middleware_js_1.authenticate, certificate_controller_js_1.CertificateController.getCertificates);
router.post('/issue', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.CERTIFICATES_ISSUE), certificate_controller_js_1.CertificateController.issueCertificate);
exports.certificateRoutes = router;
//# sourceMappingURL=certificate.routes.js.map