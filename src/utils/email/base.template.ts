export interface BaseEmailProps {
  title: string;
  preheader?: string;
  content: string;
}

export function renderBaseEmail({ title, preheader, content }: BaseEmailProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%);
      padding: 32px 24px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      display: inline-block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .header-title {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .header-tagline {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #a7f3d0;
      font-weight: 400;
    }
    .content-body {
      padding: 36px 32px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer-links a {
      color: #059669;
      text-decoration: none;
      margin: 0 8px;
    }
    .btn {
      display: inline-block;
      padding: 12px 28px;
      background: #059669;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .otp-code {
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 8px;
      color: #065f46;
      background: #ecfdf5;
      padding: 16px 28px;
      border-radius: 8px;
      border: 1px dashed #059669;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  ${preheader ? `<div style="display:none;font-size:1px;color:#f8fafc;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</div>` : ''}
  <div class="wrapper">
    <table class="container" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <div class="header-logo">A</div>
          <h1 class="header-title">Adele Empowerment Foundation</h1>
          <p class="header-tagline">Building Skills • Transforming Communities • Empowering Lives</p>
        </td>
      </tr>
      <tr>
        <td class="content-body">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px 0;"><strong>Adele Empowerment Foundation</strong></p>
          <p style="margin: 0 0 12px 0;">Plot 104, Adele Empowerment Crescent, Central Business District, Lagos, Nigeria</p>
          <div class="footer-links">
            <a href="https://adelefoundation.org">Website</a> •
            <a href="mailto:support@adelefoundation.org">Support</a> •
            <a href="https://adelefoundation.org/privacy">Privacy Policy</a>
          </div>
          <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">© ${new Date().getFullYear()} Adele Empowerment Foundation. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}
