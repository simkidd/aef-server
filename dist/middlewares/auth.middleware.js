"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const index_js_1 = require("../utils/index.js");
const user_model_js_1 = require("../models/user.model.js");
const role_model_js_1 = require("../models/role.model.js");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, index_js_1.verifyAccessToken)(token);
        const user = await user_model_js_1.User.findById(decoded.userId).lean();
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
            return;
        }
        // Resolve all permissions from assigned roles + custom permissions
        const roles = await role_model_js_1.Role.find({ code: { $in: user.roles } }).lean();
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
                scopeType: s.scopeType,
                targetId: s.targetId?.toString(),
                targetName: s.targetName,
            })) || [],
            isStaff: user.isStaff,
            isBeneficiary: user.isBeneficiary,
            staffRecordId: user.staffRecordId?.toString(),
            beneficiaryProfileId: user.beneficiaryProfileId?.toString(),
        };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
            return;
        }
        res.status(401).json({ success: false, message: 'Invalid authentication token.' });
        return;
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map