"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centreRoutes = void 0;
const express_1 = require("express");
const centre_controller_js_1 = require("../controllers/centre.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const rbac_middleware_js_1 = require("../middlewares/rbac.middleware.js");
const permissions_js_1 = require("../constants/permissions.js");
const router = (0, express_1.Router)();
// Training Centres
router.get('/', centre_controller_js_1.CentreController.getCentres);
router.get('/:id', centre_controller_js_1.CentreController.getCentreById);
router.post('/', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.CENTRES_MANAGE), centre_controller_js_1.CentreController.createCentre);
router.put('/:id', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.CENTRES_MANAGE), centre_controller_js_1.CentreController.updateCentre);
// Rooms & Facilities
router.get('/facilities/rooms', centre_controller_js_1.CentreController.getRooms);
router.post('/facilities/rooms', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.FACILITIES_MANAGE), centre_controller_js_1.CentreController.createRoom);
// Assets
router.get('/assets/all', auth_middleware_js_1.authenticate, centre_controller_js_1.CentreController.getAssets);
router.post('/assets', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.ASSETS_MANAGE), centre_controller_js_1.CentreController.createAsset);
// Documents
router.get('/documents/all', auth_middleware_js_1.authenticate, centre_controller_js_1.CentreController.getDocuments);
router.post('/documents', auth_middleware_js_1.authenticate, (0, rbac_middleware_js_1.requirePermission)(permissions_js_1.PERMISSIONS.DOCUMENTS_MANAGE), centre_controller_js_1.CentreController.createDocument);
exports.centreRoutes = router;
//# sourceMappingURL=centre.routes.js.map