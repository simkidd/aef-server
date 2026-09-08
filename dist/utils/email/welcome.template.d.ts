export interface WelcomeEmailProps {
    name: string;
    role?: string;
    beneficiaryCode?: string;
    loginUrl?: string;
}
export declare function renderWelcomeEmail({ name, role, beneficiaryCode, loginUrl, }: WelcomeEmailProps): string;
