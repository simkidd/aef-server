"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.verifyAccessToken = verifyAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_SECRET, {
        expiresIn: env_js_1.ENV.JWT_EXPIRES_IN,
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_REFRESH_SECRET, {
        expiresIn: env_js_1.ENV.JWT_REFRESH_EXPIRES_IN,
    });
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_REFRESH_SECRET);
}
//# sourceMappingURL=jwt.js.map