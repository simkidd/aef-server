import { sendEmail } from '../mailer.js';
import { renderBaseEmail, BaseEmailProps } from './base.template.js';
import { renderOtpEmail, OtpEmailProps } from './otp.template.js';
import { renderWelcomeEmail, WelcomeEmailProps } from './welcome.template.js';
import { renderApplicationStatusEmail, ApplicationStatusEmailProps } from './application-status.template.js';

export * from './base.template.js';
export * from './otp.template.js';
export * from './welcome.template.js';
export * from './application-status.template.js';

/**
 * Helper to dispatch an OTP verification email using Brevo
 */
export async function sendOtpEmail(
  to: string,
  otpProps: OtpEmailProps
): Promise<boolean> {
  const htmlContent = renderOtpEmail(otpProps);
  return sendEmail({
    to,
    subject: `Your Verification Code: ${otpProps.otp} - Adele Foundation`,
    htmlContent,
  });
}

/**
 * Helper to dispatch a Welcome email using Brevo
 */
export async function sendWelcomeEmail(
  to: string,
  welcomeProps: WelcomeEmailProps
): Promise<boolean> {
  const htmlContent = renderWelcomeEmail(welcomeProps);
  return sendEmail({
    to,
    subject: 'Welcome to Adele Empowerment Foundation',
    htmlContent,
  });
}

/**
 * Helper to dispatch an Application Status email using Brevo
 */
export async function sendApplicationStatusEmail(
  to: string,
  statusProps: ApplicationStatusEmailProps
): Promise<boolean> {
  const htmlContent = renderApplicationStatusEmail(statusProps);
  return sendEmail({
    to,
    subject: `Application Update: ${statusProps.status} - ${statusProps.programTitle}`,
    htmlContent,
  });
}
