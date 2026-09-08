import { OtpEmailProps } from './otp.template.js';
import { WelcomeEmailProps } from './welcome.template.js';
import { ApplicationStatusEmailProps } from './application-status.template.js';
export * from './base.template.js';
export * from './otp.template.js';
export * from './welcome.template.js';
export * from './application-status.template.js';
/**
 * Helper to dispatch an OTP verification email using Brevo
 */
export declare function sendOtpEmail(to: string, otpProps: OtpEmailProps): Promise<boolean>;
/**
 * Helper to dispatch a Welcome email using Brevo
 */
export declare function sendWelcomeEmail(to: string, welcomeProps: WelcomeEmailProps): Promise<boolean>;
/**
 * Helper to dispatch an Application Status email using Brevo
 */
export declare function sendApplicationStatusEmail(to: string, statusProps: ApplicationStatusEmailProps): Promise<boolean>;
