"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const staff_model_js_1 = require("../models/staff.model.js");
const staff_model_js_2 = require("../models/staff.model.js");
const staff_model_js_3 = require("../models/staff.model.js");
const user_model_js_1 = require("../models/user.model.js");
const auth_model_js_1 = require("../models/auth.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class StaffController {
    static getStaffList = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, status, search, page, limit } = req.query;
        const filter = {};
        if (centreId)
            filter.assignedCentreId = centreId;
        if (status)
            filter.employmentStatus = status.toLowerCase();
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { staffCode: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { position: { $regex: search, $options: 'i' } },
            ];
        }
        const hasSensitivePerm = req.user?.permissions.includes('staff:sensitive_view') || req.user?.roles.includes('SUPER_ADMIN');
        const projection = hasSensitivePerm ? '' : '-salaryInfo';
        const result = await (0, index_js_1.paginate)(staff_model_js_1.Staff, filter, {
            page: page,
            limit: limit,
            select: projection,
            populate: [
                { path: 'assignedCentreId', select: 'name centreCode' },
                { path: 'managerId', select: 'firstName lastName position' },
            ],
            sort: { dateJoined: -1 },
        });
        (0, index_js_1.sendSuccess)(res, result.docs, 'Staff list retrieved', 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
    static createStaff = (0, index_js_1.asyncHandler)(async (req, res) => {
        const count = await staff_model_js_1.Staff.countDocuments();
        const staffCode = `AEF-STF-${String(count + 1).padStart(4, '0')}`;
        const staff = await staff_model_js_1.Staff.create({
            ...req.body,
            staffCode: req.body.staffCode || staffCode,
        });
        await audit_service_js_1.AuditService.log({
            req,
            action: 'STAFF_CREATED',
            entityType: 'Staff',
            entityId: staff._id.toString(),
            centreId: staff.assignedCentreId?.toString(),
            afterState: staff.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, staff, 'Staff record created', 201);
    });
    static updateStaff = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const before = await staff_model_js_1.Staff.findById(id).lean();
        const updated = await staff_model_js_1.Staff.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            throw new index_js_1.AppError('Staff member not found', 404);
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: 'STAFF_UPDATED',
            entityType: 'Staff',
            entityId: updated._id.toString(),
            centreId: updated.assignedCentreId?.toString(),
            beforeState: before || {},
            afterState: updated.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, updated, 'Staff record updated');
    });
    static createStaffUserAccount = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { staffId } = req.params;
        const { password, roles, scopeAssignments } = req.body;
        const staff = await staff_model_js_1.Staff.findById(staffId);
        if (!staff) {
            throw new index_js_1.AppError('Staff record not found', 404);
        }
        let user = await user_model_js_1.User.findOne({ email: staff.email.toLowerCase() });
        if (user) {
            user.isStaff = true;
            user.staffRecordId = staff._id;
            user.roles = roles || ['TRAINER'];
            user.scopeAssignments = scopeAssignments || [{ scopeType: 'GLOBAL' }];
            await user.save();
            if (password) {
                let auth = await auth_model_js_1.Auth.findOne({ userId: user._id });
                if (auth) {
                    auth.password = password;
                    await auth.save();
                }
                else {
                    await auth_model_js_1.Auth.create({
                        userId: user._id,
                        email: user.email,
                        password,
                    });
                }
            }
        }
        else {
            user = await user_model_js_1.User.create({
                email: staff.email.toLowerCase(),
                firstName: staff.firstName,
                lastName: staff.lastName,
                phone: staff.phone,
                isStaff: true,
                isBeneficiary: false,
                staffRecordId: staff._id,
                roles: roles || ['TRAINER'],
                scopeAssignments: scopeAssignments || [
                    {
                        scopeType: staff.assignedCentreId ? 'CENTRE' : 'GLOBAL',
                        targetId: staff.assignedCentreId,
                    },
                ],
            });
            await auth_model_js_1.Auth.create({
                userId: user._id,
                email: user.email,
                password: password || 'Adele@2026',
            });
        }
        staff.hasSystemAccount = true;
        staff.userId = user._id;
        await staff.save();
        await audit_service_js_1.AuditService.log({
            req,
            action: 'STAFF_ACCOUNT_PROVISIONED',
            entityType: 'User',
            entityId: user._id.toString(),
            centreId: staff.assignedCentreId?.toString(),
            reason: `Provisioned login account for staff member ${staff.firstName} ${staff.lastName}`,
        });
        (0, index_js_1.sendSuccess)(res, { userId: user._id, email: user.email, roles: user.roles }, 'System account provisioned successfully');
    });
    // Volunteers
    static getVolunteers = (0, index_js_1.asyncHandler)(async (req, res) => {
        const volunteers = await staff_model_js_2.Volunteer.find()
            .populate('assignedCentreId', 'name')
            .sort({ startDate: -1 });
        (0, index_js_1.sendSuccess)(res, volunteers);
    });
    static createVolunteer = (0, index_js_1.asyncHandler)(async (req, res) => {
        const count = await staff_model_js_2.Volunteer.countDocuments();
        const code = `AEF-VOL-${String(count + 1).padStart(4, '0')}`;
        const volunteer = await staff_model_js_2.Volunteer.create({
            ...req.body,
            volunteerCode: req.body.volunteerCode || code,
        });
        (0, index_js_1.sendSuccess)(res, volunteer, 'Volunteer registered', 201);
    });
    // Partners
    static getPartners = (0, index_js_1.asyncHandler)(async (req, res) => {
        const partners = await staff_model_js_3.Partner.find().populate('programsSponsored', 'title code').sort({ name: 1 });
        (0, index_js_1.sendSuccess)(res, partners);
    });
    static createPartner = (0, index_js_1.asyncHandler)(async (req, res) => {
        const partner = await staff_model_js_3.Partner.create(req.body);
        await audit_service_js_1.AuditService.log({
            req,
            action: 'PARTNER_CREATED',
            entityType: 'Partner',
            entityId: partner._id.toString(),
            afterState: partner.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, partner, 'Partner created', 201);
    });
}
exports.StaffController = StaffController;
//# sourceMappingURL=staff.controller.js.map