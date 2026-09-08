"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWelcomeEmail = renderWelcomeEmail;
const base_template_js_1 = require("./base.template.js");
function renderWelcomeEmail({ name, role = 'Beneficiary', beneficiaryCode, loginUrl = 'http://localhost:3000/login', }) {
    const content = `
    <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Welcome to AEF, ${name}!</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      Your account on the <strong>Adele Empowerment Foundation</strong> platform has been successfully activated.
    </p>

    ${beneficiaryCode
        ? `
    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <div style="font-size: 12px; color: #065f46; font-weight: 600; text-transform: uppercase;">Your Beneficiary ID</div>
      <div style="font-size: 20px; font-weight: 800; color: #047857; margin-top: 4px;">${beneficiaryCode}</div>
    </div>`
        : ''}

    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      You can now log in to the portal to browse available skill empowerment programs, submit applications, check your timetable, and track your attendance and certifications.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" class="btn">Access Your Portal</a>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #64748b;">
      If you need any guidance or support getting started, our team is always ready to assist you.
    </p>
  `;
    return (0, base_template_js_1.renderBaseEmail)({
        title: 'Welcome to Adele Empowerment Foundation',
        preheader: `Welcome to Adele Empowerment Foundation, ${name}. Your account is ready.`,
        content,
    });
}
//# sourceMappingURL=welcome.template.js.map