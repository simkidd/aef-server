import { AuditLog } from '../../models/auditLog.model.js';
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

export class AuditService {
  public static async log(params: AuditLogParams): Promise<void> {
    try {
      const user = params.req?.user;
      const ip = params.ipAddress || (params.req ? params.req.ip || params.req.socket.remoteAddress : undefined);
      const ua = params.userAgent || (params.req ? params.req.headers['user-agent'] : undefined);

      await AuditLog.create({
        userId: params.userId || user?.userId,
        userEmail: params.userEmail || user?.email || 'system@adelefoundation.org',
        userName: params.userName || (user ? `${user.firstName} ${user.lastName}` : 'System Automated'),
        userRole: params.userRole || user?.roles?.[0] || 'SYSTEM',
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        centreId: params.centreId,
        programId: params.programId,
        cohortId: params.cohortId,
        beforeState: params.beforeState,
        afterState: params.afterState,
        reason: params.reason,
        ipAddress: ip,
        userAgent: ua,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('[AuditService Error] Failed to write audit log:', err);
    }
  }
}
