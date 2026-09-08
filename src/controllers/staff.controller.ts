import { Request, Response } from 'express';
import { Staff } from '../models/staff.model.js';
import { Volunteer } from '../models/staff.model.js';
import { Partner } from '../models/staff.model.js';
import { User } from '../models/user.model.js';
import { Auth } from '../models/auth.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';

export class StaffController {
  public static getStaffList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { centreId, status, search, page, limit } = req.query;
    const filter: any = {};

    if (centreId) filter.assignedCentreId = centreId;
    if (status) filter.employmentStatus = (status as string).toLowerCase();
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

    const result = await paginate(Staff, filter, {
      page: page as string,
      limit: limit as string,
      select: projection,
      populate: [
        { path: 'assignedCentreId', select: 'name centreCode' },
        { path: 'managerId', select: 'firstName lastName position' },
      ],
      sort: { dateJoined: -1 },
    });

    sendSuccess(res, result.docs, 'Staff list retrieved', 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.pages,
    });
  });

  public static createStaff = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const count = await Staff.countDocuments();
    const staffCode = `AEF-STF-${String(count + 1).padStart(4, '0')}`;

    const staff = await Staff.create({
      ...req.body,
      staffCode: req.body.staffCode || staffCode,
    });

    await AuditService.log({
      req,
      action: 'STAFF_CREATED',
      entityType: 'Staff',
      entityId: staff._id.toString(),
      centreId: staff.assignedCentreId?.toString(),
      afterState: staff.toObject(),
    });

    sendSuccess(res, staff, 'Staff record created', 201);
  });

  public static updateStaff = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const before = await Staff.findById(id).lean();
    const updated = await Staff.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      throw new AppError('Staff member not found', 404);
    }

    await AuditService.log({
      req,
      action: 'STAFF_UPDATED',
      entityType: 'Staff',
      entityId: updated._id.toString(),
      centreId: updated.assignedCentreId?.toString(),
      beforeState: before || {},
      afterState: updated.toObject(),
    });

    sendSuccess(res, updated, 'Staff record updated');
  });

  public static createStaffUserAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { staffId } = req.params;
    const { password, roles, scopeAssignments } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) {
      throw new AppError('Staff record not found', 404);
    }

    let user = await User.findOne({ email: staff.email.toLowerCase() });
    if (user) {
      user.isStaff = true;
      user.staffRecordId = staff._id as any;
      user.roles = roles || ['TRAINER'];
      user.scopeAssignments = scopeAssignments || [{ scopeType: 'GLOBAL' }];
      await user.save();

      if (password) {
        let auth = await Auth.findOne({ userId: user._id });
        if (auth) {
          auth.password = password;
          await auth.save();
        } else {
          await Auth.create({
            userId: user._id,
            email: user.email,
            password,
          });
        }
      }
    } else {
      user = await User.create({
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

      await Auth.create({
        userId: user._id,
        email: user.email,
        password: password || 'Adele@2026',
      });
    }

    staff.hasSystemAccount = true;
    staff.userId = user._id as any;
    await staff.save();

    await AuditService.log({
      req,
      action: 'STAFF_ACCOUNT_PROVISIONED',
      entityType: 'User',
      entityId: user._id.toString(),
      centreId: staff.assignedCentreId?.toString(),
      reason: `Provisioned login account for staff member ${staff.firstName} ${staff.lastName}`,
    });

    sendSuccess(res, { userId: user._id, email: user.email, roles: user.roles }, 'System account provisioned successfully');
  });

  // Volunteers
  public static getVolunteers = asyncHandler(async (req: Request, res: Response) => {
    const volunteers = await Volunteer.find()
      .populate('assignedCentreId', 'name')
      .sort({ startDate: -1 });
    sendSuccess(res, volunteers);
  });

  public static createVolunteer = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const count = await Volunteer.countDocuments();
    const code = `AEF-VOL-${String(count + 1).padStart(4, '0')}`;
    const volunteer = await Volunteer.create({
      ...req.body,
      volunteerCode: req.body.volunteerCode || code,
    });
    sendSuccess(res, volunteer, 'Volunteer registered', 201);
  });

  // Partners
  public static getPartners = asyncHandler(async (req: Request, res: Response) => {
    const partners = await Partner.find().populate('programsSponsored', 'title code').sort({ name: 1 });
    sendSuccess(res, partners);
  });

  public static createPartner = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const partner = await Partner.create(req.body);
    await AuditService.log({
      req,
      action: 'PARTNER_CREATED',
      entityType: 'Partner',
      entityId: partner._id.toString(),
      afterState: partner.toObject(),
    });
    sendSuccess(res, partner, 'Partner created', 201);
  });
}
