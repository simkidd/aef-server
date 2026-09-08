export interface ApplicationStatusEmailProps {
    name: string;
    applicationNumber: string;
    programTitle: string;
    status: string;
    details?: string;
    actionUrl?: string;
}
export declare function renderApplicationStatusEmail({ name, applicationNumber, programTitle, status, details, actionUrl, }: ApplicationStatusEmailProps): string;
