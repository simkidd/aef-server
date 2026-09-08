"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_model_js_1 = require("../models/user.model.js");
const role_model_js_1 = require("../models/role.model.js");
const auditLog_model_js_1 = require("../models/auditLog.model.js");
const permissions_js_1 = require("../constants/permissions.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class AdminController {
    // Users Management
    static getUsers = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { role, isStaff, search, page, limit } = req.query;
        const filter = {};
        if (role)
            filter.roles = role;
        if (isStaff !== undefined)
            filter.isStaff = isStaff === 'true';
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
            ];
        }
        const result = await (0, index_js_1.paginate)(user_model_js_1.User, filter, {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: [
                { path: 'staffRecordId', select: 'position departmentId assignedCentreId' },
                { path: 'beneficiaryProfileId', select: 'beneficiaryCode' },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Users retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    static updateUserRolesAndScopes = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { roles, customPermissions, scopeAssignments, isActive } = req.body;
        const user = await user_model_js_1.User.findById(id);
        if (!user) {
            throw new index_js_1.AppError('User not found', 404);
        }
        const before = { roles: user.roles, scopeAssignments: user.scopeAssignments, isActive: user.isActive };
        if (roles)
            user.roles = roles;
        if (customPermissions)
            user.customPermissions = customPermissions;
        if (scopeAssignments)
            user.scopeAssignments = scopeAssignments;
        if (isActive !== undefined)
            user.isActive = isActive;
        await user.save();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'USER_ROLES_AND_SCOPES_UPDATED',
            entityType: 'User',
            entityId: user._id.toString(),
            beforeState: before,
            afterState: { roles: user.roles, scopeAssignments: user.scopeAssignments, isActive: user.isActive },
            reason: 'Administrative role/scope reassignment',
        });
        (0, index_js_1.sendSuccess)(res, user, 'User updated successfully');
    });
    // Roles & Permissions Matrix
    static getRoles = (0, index_js_1.asyncHandler)(async (req, res) => {
        const roles = await role_model_js_1.Role.find().sort({ isSystem: -1, name: 1 });
        const allPermissionsList = Object.entries(permissions_js_1.PERMISSIONS).map(([name, code]) => ({
            code,
            name,
            module: code.split(':')[0],
        }));
        (0, index_js_1.sendSuccess)(res, {
            roles,
            allPermissions: allPermissionsList,
        });
    });
    static updateRolePermissions = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { permissions, description } = req.body;
        const role = await role_model_js_1.Role.findById(id);
        if (!role) {
            throw new index_js_1.AppError('Role not found', 404);
        }
        const before = { permissions: role.permissions };
        role.permissions = permissions || role.permissions;
        if (description)
            role.description = description;
        await role.save();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'ROLE_PERMISSIONS_MODIFIED',
            entityType: 'Role',
            entityId: role._id.toString(),
            beforeState: before,
            afterState: { permissions: role.permissions },
            reason: `Updated permissions for role: ${role.name}`,
        });
        (0, index_js_1.sendSuccess)(res, role, 'Role permissions saved');
    });
    // Audit Trail Explorer
    static getAuditLogs = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { action, entityType, userId, centreId, startDate, endDate, search, page, limit } = req.query;
        const filter = {};
        if (action)
            filter.action = action;
        if (entityType)
            filter.entityType = entityType;
        if (userId)
            filter.userId = userId;
        if (centreId)
            filter.centreId = centreId;
        if (startDate && endDate) {
            filter.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
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
        const result = await (0, index_js_1.paginate)(auditLog_model_js_1.AuditLog, filter, {
            page: page,
            limit: limit,
            sort: { timestamp: -1 },
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Audit logs retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    // Settings
    static getSettings = (0, index_js_1.asyncHandler)(async (req, res) => {
        const settings = await auditLog_model_js_1.OrgSettings.find();
        (0, index_js_1.sendSuccess)(res, settings);
    });
    static updateSetting = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { key, value, description, category } = req.body;
        const setting = await auditLog_model_js_1.OrgSettings.findOneAndUpdate({ key }, {
            key,
            value,
            description,
            category: category || 'General',
            lastUpdatedBy: req.user?.userId,
        }, { upsert: true, new: true });
        (0, index_js_1.sendSuccess)(res, setting, 'Setting saved');
    });
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map