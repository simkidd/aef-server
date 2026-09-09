import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { AuditLog, OrgSettings } from '../models/auditLog.model.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';

export class AdminController {
  // Users Management
  public static getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { role, isStaff, search, page, limit } = req.query;
    const filter: any = {};
    if (role) filter.roles = role;
    if (isStaff !== undefined) filter.isStaff = isStaff === 'true';
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ];
    }

    const result = await paginate(User, filter, {
      page: page as string,
      limit: limit as string,
      sort: { createdAt: -1 },
      populate: [
        { path: 'staffRecordId', select: 'position departmentId assignedCentreId' },
        { path: 'beneficiaryProfileId', select: 'beneficiaryCode' },
      ],
    });

    sendSuccess(res, result.docs, 'Users retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  public static getUserStats = asyncHandler(async (_req: Request, res: Response) => {
    const [totalUsers, staffUsers, beneficiaryUsers, activeUsers, inactiveUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isStaff: true }),
      User.countDocuments({ isStaff: false }),
      User.countDocuments({ isActive: { $ne: false } }),
      User.countDocuments({ isActive: false }),
    ]);

    sendSuccess(res, {
      totalUsers,
      staffUsers,
      beneficiaryUsers,
      activeUsers,
      inactiveUsers,
    }, 'User statistics retrieved');
  });

  public static updateUserRolesAndScopes = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { roles, customPermissions, scopeAssignments, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const currentUserId = req.user?.userId;
    if (currentUserId && currentUserId === user._id.toString()) {
      if (isActive === false) {
        throw new AppError('You cannot deactivate your own user account', 400);
      }
    }

    const before = { roles: user.roles, scopeAssignments: user.scopeAssignments, isActive: user.isActive };

    if (roles) user.roles = roles;
    if (customPermissions) user.customPermissions = customPermissions;
    if (scopeAssignments) user.scopeAssignments = scopeAssignments;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    await AuditService.log({
      req,
      action: 'USER_ROLES_AND_SCOPES_UPDATED',
      entityType: 'User',
      entityId: user._id.toString(),
      beforeState: before,
      afterState: { roles: user.roles, scopeAssignments: user.scopeAssignments, isActive: user.isActive },
      reason: 'Administrative role/scope reassignment',
    });

    sendSuccess(res, user, 'User updated successfully');
  });

  // Roles & Permissions Matrix
  public static getRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await Role.find().sort({ isSystem: -1, name: 1 });
    const allPermissionsList = Object.entries(PERMISSIONS).map(([name, code]) => ({
      code,
      name,
      module: code.split(':')[0],
    }));

    sendSuccess(res, {
      roles,
      allPermissions: allPermissionsList,
    });
  });

  public static updateRolePermissions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { permissions, description } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }

    const before = { permissions: role.permissions };
    role.permissions = permissions || role.permissions;
    if (description) role.description = description;
    await role.save();

    await AuditService.log({
      req,
      action: 'ROLE_PERMISSIONS_MODIFIED',
      entityType: 'Role',
      entityId: role._id.toString(),
      beforeState: before,
      afterState: { permissions: role.permissions },
      reason: `Updated permissions for role: ${role.name}`,
    });

    sendSuccess(res, role, 'Role permissions saved');
  });

  // Audit Trail Explorer
  public static getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const { action, entityType, userId, centreId, startDate, endDate, search, page, limit } = req.query;
    const filter: any = {};
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;
    if (userId) filter.userId = userId;
    if (centreId) filter.centreId = centreId;
    if (startDate && endDate) {
      filter.timestamp = { $gte: new Date(startDate as string), $lte: new Date(endDate as string) };
    }
    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      filter.$or = [
        { userName: searchRegex },
        { userEmail: searchRegex },
        { entityId: searchRegex },
        { action: searchRegex },
        { entityType: searchRegex },
        { reason: searchRegex },
      ];
    }

    const result = await paginate(AuditLog, filter, {
      page: page as string,
      limit: limit as string,
      sort: { timestamp: -1 },
    });

    sendSuccess(res, result.docs, 'Audit logs retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  // Settings
  public static getSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await OrgSettings.find();
    sendSuccess(res, settings);
  });

  public static updateSetting = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { key, value, description, category } = req.body;
    const setting = await OrgSettings.findOneAndUpdate(
      { key },
      {
        key,
        value,
        description,
        category: category || 'General',
        lastUpdatedBy: req.user?.userId,
      },
      { upsert: true, new: true }
    );
    sendSuccess(res, setting, 'Setting saved');
  });
}
