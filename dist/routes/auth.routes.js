"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_js_1 = require("../controllers/auth.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.post('/login', auth_controller_js_1.AuthController.login);
router.post('/register', auth_controller_js_1.AuthController.registerBeneficiary);
router.post('/send-otp', auth_controller_js_1.AuthController.sendOtp);
router.post('/verify-otp', auth_controller_js_1.AuthController.verifyOtp);
router.post('/refresh', auth_controller_js_1.AuthController.refresh);
router.post('/logout', auth_controller_js_1.AuthController.logout);
router.get('/me', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.getMe);
router.put('/profile', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.updateProfile);
router.put('/change-password', auth_middleware_js_1.authenticate, auth_controller_js_1.AuthController.changePassword);
exports.authRoutes = router;
//# sourceMappingURL=auth.routes.js.map