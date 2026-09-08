import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { PermissionCode } from '../constants/permissions.js';
export declare const requirePermission: (requiredPermission: PermissionCode) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireAnyPermission: (requiredPermissions: PermissionCode[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const checkScope: (targetType: "CENTRE" | "PROGRAM" | "DEPARTMENT", getTargetId: (req: AuthenticatedRequest) => string | undefined) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
