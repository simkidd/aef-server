export interface OtpEmailProps {
    otp: string;
    recipientName?: string;
    purpose?: string;
    expiresInMinutes?: number;
}
export declare function renderOtpEmail({ otp, recipientName, purpose, expiresInMinutes, }: OtpEmailProps): string;
