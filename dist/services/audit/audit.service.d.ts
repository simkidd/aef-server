import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';
export interface AuditLogParams {
    req?: AuthenticatedRequest;
    userId?: string;
    userEmail?: string;
    userName?: string;
    userRole?: string;
    action: string;
    entityType: string;
    entityId: string;
    centreId?: string;
    programId?: string;
    cohortId?: string;
    beforeState?: Record<string, any>;
    afterState?: Record<string, any>;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditService {
    static log(params: AuditLogParams): Promise<void>;
}
