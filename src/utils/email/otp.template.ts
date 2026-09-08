import { renderBaseEmail } from './base.template.js';

export interface OtpEmailProps {
  otp: string;
  recipientName?: string;
  purpose?: string;
  expiresInMinutes?: number;
}

export function renderOtpEmail({
  otp,
  recipientName = 'Valued Member',
  purpose = 'Account Verification',
  expiresInMinutes = 10,
}: OtpEmailProps): string {
  const content = `
    <h2 style="margin-top: 0; color: #0f172a; font-size: 20px; font-weight: 700;">Hello, ${recipientName}</h2>
    <p style="font-size: 15px; line-height: 1.6; color: #334155;">
      You recently requested a one-time verification code for <strong>${purpose}</strong> on the Adele Empowerment Foundation platform.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">Your One-Time Passcode</div>
      <div class="otp-code">${otp}</div>
      <p style="font-size: 13px; color: #64748b; margin-top: 8px;">
        ⏱️ This code will expire in <strong>${expiresInMinutes} minutes</strong>.
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #475569; background-color: #f8fafc; padding: 14px 18px; border-radius: 8px; border-left: 4px solid #059669;">
      <strong>Security Notice:</strong> If you did not initiate this request, please disregard this email or notify our security team immediately at <a href="mailto:security@adelefoundation.org" style="color: #059669;">security@adelefoundation.org</a>.
    </p>
  `;

  return renderBaseEmail({
    title: `Your Verification Code: ${otp}`,
    preheader: `Your one-time passcode is ${otp}. Valid for ${expiresInMinutes} minutes.`,
    content,
  });
}
