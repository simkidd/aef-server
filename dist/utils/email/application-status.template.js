"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderApplicationStatusEmail = renderApplicationStatusEmail;
const base_template_js_1 = require("./base.template.js");
function renderApplicationStatusEmail({ name, applicationNumber, programTitle, status, details, actionUrl = 'http://localhost:3000/portal/applications', }) {
    const isPositive = ['Selected', 'Shortlisted', 'Enrollment Confirmed'].includes(status);
    const statusColor = isPositive ? '#059669' : '#d97706';
    const content = `
    <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Hello, ${name}</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      There is an update on your application for <strong>${programTitle}</strong>.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 13px; color: #64748b;">Application No:</span>
        <span style="font-size: 13px; font-weight: 600; color: #1e293b;">${applicationNumber}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 13px; color: #64748b;">Program:</span>
        <span style="font-size: 13px; font-weight: 600; color: #1e293b;">${programTitle}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="font-size: 13px; color: #64748b;">Current Status:</span>
        <span style="font-size: 14px; font-weight: 700; color: ${statusColor};">${status}</span>
      </div>
    </div>

    ${details
        ? `
    <p style="font-size: 14px; line-height: 1.6; color: #334155; background: #ecfdf5; padding: 14px 18px; border-radius: 8px;">
      ${details}
    </p>`
        : ''}

    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" class="btn">View Application Details</a>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #94a3b8;">
      Thank you for being part of the Adele Empowerment Foundation community.
    </p>
  `;
    return (0, base_template_js_1.renderBaseEmail)({
        title: `Application Update: ${status} - ${programTitle}`,
        preheader: `Your application (${applicationNumber}) status is now ${status}.`,
        content,
    });
}
//# sourceMappingURL=application-status.template.js.map