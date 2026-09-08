import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/index.js';
import { User, IUserDocument } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { ScopeType } from '../constants/permissions.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
    scopeAssignments: {
      scopeType: ScopeType;
      targetId?: string;
      targetName?: string;
    }[];
    isStaff: boolean;
    isBeneficiary: boolean;
    staffRecordId?: string;
    beneficiaryProfileId?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId).lean();
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
      return;
    }

    // Resolve all permissions from assigned roles + custom permissions
    const roles = await Role.find({ code: { $in: user.roles } }).lean();
    const rolePermissions = roles.flatMap((r) => r.permissions || []);
    const allPermissions = Array.from(new Set([...rolePermissions, ...(user.customPermissions || [])]));

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      permissions: allPermissions,
      scopeAssignments: user.scopeAssignments?.map((s) => ({
        scopeType: s.scopeType as ScopeType,
        targetId: s.targetId?.toString(),
        targetName: s.targetName,
      })) || [],
      isStaff: user.isStaff,
      isBeneficiary: user.isBeneficiary,
      staffRecordId: user.staffRecordId?.toString(),
      beneficiaryProfileId: user.beneficiaryProfileId?.toString(),
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      return;
    }
    res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    return;
  }
};
