"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orgRoutes = void 0;
const express_1 = require("express");
const org_controller_js_1 = require("../controllers/org.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
router.get('/info', org_controller_js_1.OrgController.getOrgInfo);
router.put('/info', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ORG_MANAGE), org_controller_js_1.OrgController.updateOrgInfo);
exports.orgRoutes = router;
//# sourceMappingURL=org.routes.js.map