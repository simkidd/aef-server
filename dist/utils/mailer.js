"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const env_js_1 = require("../config/env.js");
const logger_js_1 = require("./logger.js");
async function sendEmail(payload) {
    const { to, subject, htmlContent, fromName, fromEmail } = payload;
    const apiKey = env_js_1.ENV.BREVO_API_KEY;
    if (!apiKey) {
        logger_js_1.logger.warn(`No email provider API key configured in ENV — skipping email dispatch to: ${to} | subject: ${subject}`);
        return false;
    }
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    name: fromName || env_js_1.ENV.BREVO_FROM_NAME,
                    email: fromEmail || env_js_1.ENV.BREVO_FROM_EMAIL,
                },
                to: [{ email: to }],
                subject,
                htmlContent,
            }),
        });
        if (!response.ok) {
            const errBody = await response.text();
            logger_js_1.logger.error(`Email sending failed: ${response.statusText} - ${errBody}`);
            return false;
        }
        logger_js_1.logger.info(`Email successfully dispatched to ${to}`);
        return true;
    }
    catch (error) {
        logger_js_1.logger.error(`Error sending email to ${to}: ${error.message}`);
        return false;
    }
}
//# sourceMappingURL=mailer.js.map