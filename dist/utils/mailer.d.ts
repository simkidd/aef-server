export interface EmailPayload {
    to: string;
    subject: string;
    htmlContent: string;
    fromName?: string;
    fromEmail?: string;
}
export declare function sendEmail(payload: EmailPayload): Promise<boolean>;
