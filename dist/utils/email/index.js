"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendApplicationStatusEmail = sendApplicationStatusEmail;
const mailer_js_1 = require("../mailer.js");
const otp_template_js_1 = require("./otp.template.js");
const welcome_template_js_1 = require("./welcome.template.js");
const application_status_template_js_1 = require("./application-status.template.js");
__exportStar(require("./base.template.js"), exports);
__exportStar(require("./otp.template.js"), exports);
__exportStar(require("./welcome.template.js"), exports);
__exportStar(require("./application-status.template.js"), exports);
/**
 * Helper to dispatch an OTP verification email using Brevo
 */
async function sendOtpEmail(to, otpProps) {
    const htmlContent = (0, otp_template_js_1.renderOtpEmail)(otpProps);
    return (0, mailer_js_1.sendEmail)({
        to,
        subject: `Your Verification Code: ${otpProps.otp} - Adele Foundation`,
        htmlContent,
    });
}
/**
 * Helper to dispatch a Welcome email using Brevo
 */
async function sendWelcomeEmail(to, welcomeProps) {
    const htmlContent = (0, welcome_template_js_1.renderWelcomeEmail)(welcomeProps);
    return (0, mailer_js_1.sendEmail)({
        to,
        subject: 'Welcome to Adele Empowerment Foundation',
        htmlContent,
    });
}
/**
 * Helper to dispatch an Application Status email using Brevo
 */
async function sendApplicationStatusEmail(to, statusProps) {
    const htmlContent = (0, application_status_template_js_1.renderApplicationStatusEmail)(statusProps);
    return (0, mailer_js_1.sendEmail)({
        to,
        subject: `Application Update: ${statusProps.status} - ${statusProps.programTitle}`,
        htmlContent,
    });
}
//# sourceMappingURL=index.js.map