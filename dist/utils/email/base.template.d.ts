export interface BaseEmailProps {
    title: string;
    preheader?: string;
    content: string;
}
export declare function renderBaseEmail({ title, preheader, content }: BaseEmailProps): string;
