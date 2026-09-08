"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const auditLog_model_js_1 = require("../../models/auditLog.model.js");
class AuditService {
    static async log(params) {
        try {
            const user = params.req?.user;
            const ip = params.ipAddress || (params.req ? params.req.ip || params.req.socket.remoteAddress : undefined);
            const ua = params.userAgent || (params.req ? params.req.headers['user-agent'] : undefined);
            await auditLog_model_js_1.AuditLog.create({
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
        }
        catch (err) {
            console.error('[AuditService Error] Failed to write audit log:', err);
        }
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map