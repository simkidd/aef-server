"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScope = exports.requireAnyPermission = exports.requirePermission = void 0;
const permissions_js_1 = require("../constants/permissions.js");
const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        // Super Admin has all permissions
        if (req.user.roles.includes('SUPER_ADMIN')) {
            return next();
        }
        const hasPerm = req.user.permissions.includes(requiredPermission);
        if (!hasPerm) {
            res.status(403).json({
                success: false,
                message: `Forbidden: You do not have permission '${requiredPermission}' to perform this action.`,
            });
            return;
        }
        next();
    };
};
exports.requirePermission = requirePermission;
const requireAnyPermission = (requiredPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        if (req.user.roles.includes('SUPER_ADMIN')) {
            return next();
        }
        const hasAny = requiredPermissions.some((p) => req.user?.permissions.includes(p));
        if (!hasAny) {
            res.status(403).json({
                success: false,
                message: `Forbidden: Missing required permissions.`,
            });
            return;
        }
        next();
    };
};
exports.requireAnyPermission = requireAnyPermission;
const checkScope = (targetType, getTargetId) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        // Super admin is exempt from scope limits
        if (req.user.roles.includes('SUPER_ADMIN')) {
            return next();
        }
        // Check if user has global scope
        const hasGlobal = req.user.scopeAssignments.some((s) => s.scopeType === permissions_js_1.SCOPES.GLOBAL);
        if (hasGlobal) {
            return next();
        }
        const requestedTargetId = getTargetId(req);
        if (!requestedTargetId) {
            return next(); // Target ID not specified in request, controller will apply scoped filter
        }
        const hasMatchingScope = req.user.scopeAssignments.some((s) => s.scopeType === targetType && s.targetId === requestedTargetId);
        if (!hasMatchingScope) {
            res.status(403).json({
                success: false,
                message: `Forbidden: You do not have access to this ${targetType.toLowerCase()} scope.`,
            });
            return;
        }
        next();
    };
};
exports.checkScope = checkScope;
//# sourceMappingURL=rbac.middleware.js.map