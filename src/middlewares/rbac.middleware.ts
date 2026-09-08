import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { PermissionCode, SCOPES } from '../constants/permissions.js';

export const requirePermission = (requiredPermission: PermissionCode) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

export const requireAnyPermission = (requiredPermissions: PermissionCode[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

export const checkScope = (targetType: 'CENTRE' | 'PROGRAM' | 'DEPARTMENT', getTargetId: (req: AuthenticatedRequest) => string | undefined) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    // Super admin is exempt from scope limits
    if (req.user.roles.includes('SUPER_ADMIN')) {
      return next();
    }

    // Check if user has global scope
    const hasGlobal = req.user.scopeAssignments.some((s) => s.scopeType === SCOPES.GLOBAL);
    if (hasGlobal) {
      return next();
    }

    const requestedTargetId = getTargetId(req);
    if (!requestedTargetId) {
      return next(); // Target ID not specified in request, controller will apply scoped filter
    }

    const hasMatchingScope = req.user.scopeAssignments.some(
      (s) => s.scopeType === targetType && s.targetId === requestedTargetId
    );

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
