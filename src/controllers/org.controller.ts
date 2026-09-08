import { Request, Response } from 'express';
import { Organization } from '../models/organization.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError } from '../utils/index.js';

export class OrgController {
  public static getOrgInfo = asyncHandler(async (req: Request, res: Response) => {
    let org = await Organization.findOne();
    if (!org) {
      org = await Organization.create({
        name: 'Adele Empowerment Foundation',
        code: 'AEF',
        tagline: 'Building Skills, Empowering Lives',
        email: 'info@adelefoundation.org',
        phone: '+234 800 ADELE FDN',
        address: 'Plot 104, Adele Empowerment Crescent, Central Business District',
        state: 'Lagos',
        lga: 'Ikeja',
        country: 'Nigeria',
      });
    }
    sendSuccess(res, org);
  });

  public static updateOrgInfo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const before = await Organization.findOne().lean();
    const updated = await Organization.findOneAndUpdate({}, req.body, { new: true, upsert: true });

    await AuditService.log({
      req,
      action: 'ORGANIZATION_UPDATED',
      entityType: 'Organization',
      entityId: updated._id.toString(),
      beforeState: before || {},
      afterState: updated.toObject(),
    });

    sendSuccess(res, updated, 'Organization updated successfully');
  });
}
