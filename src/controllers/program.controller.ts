import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Program, SkillArea } from '../models/program.model.js';
import { Cohort } from '../models/cohort.model.js';
import { Application } from '../models/application.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError, paginate } from '../utils/index.js';

export class ProgramController {
  // ==========================================
  // Skill Areas
  // ==========================================
  public static getSkillAreas = asyncHandler(async (req: Request, res: Response) => {
    const skills = await SkillArea.find({ isActive: true }).sort({ name: 1 });
    sendSuccess(res, skills);
  });

  public static createSkillArea = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const skill = await SkillArea.create(req.body);
    await AuditService.log({
      req,
      action: 'SKILL_AREA_CREATED',
      entityType: 'SkillArea',
      entityId: skill._id.toString(),
      afterState: skill.toObject(),
    });
    sendSuccess(res, skill, 'Skill Area created', 201);
  });

  public static updateSkillArea = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const skill = await SkillArea.findByIdAndUpdate(id, req.body, { new: true });
    if (!skill) {
      throw new AppError('Skill Area not found', 404);
    }
    sendSuccess(res, skill, 'Skill Area updated');
  });

  // ==========================================
  // Public Program Endpoints (Beneficiaries / Public)
  // ==========================================
  public static getPublishedPrograms = asyncHandler(async (req: Request, res: Response) => {
    const { search, category, organizerType, skillAreaId } = req.query;

    const filter: any = {
      published: true,
      status: { $in: ['active', 'enrolling', 'in_progress'] },
    };

    if (organizerType) {
      filter.organizerType = organizerType;
    }

    if (skillAreaId) {
      filter.skillAreaIds = skillAreaId;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { organizerName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Program.find(filter)
      .populate('skillAreaIds')
      .populate('partnerIds', 'name code type')
      .sort({ isFeatured: -1, createdAt: -1 });

    const programs = await query;

    // Filter by category if specified (from populated skillAreaIds)
    const filtered = category
      ? programs.filter((p: any) =>
          p.skillAreaIds?.some((s: any) => s.category?.toLowerCase() === (category as string).toLowerCase())
        )
      : programs;

    // Calculate slots and counts
    const enriched = await Promise.all(
      filtered.map(async (p: any) => {
        const cohortCount = await Cohort.countDocuments({
          programId: p._id,
          status: { $in: ['upcoming', 'enrolling', 'in_progress'] },
        });
        const appCount = await Application.countDocuments({ programId: p._id });
        return {
          ...p.toObject(),
          stats: {
            cohorts: cohortCount,
            applications: appCount,
          },
        };
      })
    );

    sendSuccess(res, enriched);
  });

  public static getFeaturedPrograms = asyncHandler(async (req: Request, res: Response) => {
    const programs = await Program.find({
      published: true,
      isFeatured: true,
      status: { $in: ['active', 'enrolling', 'in_progress'] },
    })
      .populate('skillAreaIds')
      .populate('partnerIds', 'name code type')
      .sort({ createdAt: -1 })
      .limit(6);

    sendSuccess(res, programs);
  });

  public static getPublishedProgramById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Strict input validation to prevent NoSQL operator tampering or path traversal
    if (!id || typeof id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new AppError('Invalid program identifier', 400);
    }

    const query: any = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, published: true }
      : {
          $or: [{ slug: id.toLowerCase() }, { code: id.toUpperCase() }],
          published: true,
        };

    const program = await Program.findOne(query)
      .populate('skillAreaIds')
      .populate('partnerIds', 'name code type');

    if (!program) {
      throw new AppError('Program not found or not published', 404);
    }

    const cohorts = await Cohort.find({
      programId: program._id,
      status: { $in: ['upcoming', 'enrolling', 'in_progress'] },
    })
      .populate('centreId', 'name centreCode state lga capacity address')
      .populate('skillConfigs.skillAreaId', 'name code category');

    sendSuccess(res, {
      program,
      cohorts,
    });
  });

  // ==========================================
  // Admin Program Endpoints (Protected)
  // ==========================================
  public static getProgramStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const [
      totalPrograms,
      adeleOwned,
      partnerInitiatives,
      activePrograms,
      draftPrograms,
      archivedPrograms,
      publishedPrograms,
      totalApplications,
      totalCohorts,
    ] = await Promise.all([
      Program.countDocuments(),
      Program.countDocuments({ organizerType: 'Adele Owned' }),
      Program.countDocuments({ organizerType: { $ne: 'Adele Owned' } }),
      Program.countDocuments({ status: { $in: ['active', 'enrolling'] } }),
      Program.countDocuments({ status: 'draft' }),
      Program.countDocuments({ status: 'archived' }),
      Program.countDocuments({ published: true }),
      Application.countDocuments(),
      Cohort.countDocuments(),
    ]);

    sendSuccess(res, {
      totalPrograms,
      adeleOwned,
      partnerInitiatives,
      activePrograms,
      draftPrograms,
      archivedPrograms,
      publishedPrograms,
      totalApplications,
      totalCohorts,
    });
  });

  public static getPrograms = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, published, organizerType, search, page, limit } = req.query;
    const filter: any = {};

    if (status) filter.status = status.toString().toLowerCase();
    if (published !== undefined) filter.published = published === 'true';
    if (organizerType) filter.organizerType = organizerType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { organizerName: { $regex: search, $options: 'i' } },
      ];
    }

    // Optional pagination
    if (page && limit) {
      const result = await paginate(Program, filter, {
        page: page as string,
        limit: limit as string,
        sort: { createdAt: -1 },
        populate: [
          { path: 'skillAreaIds' },
          { path: 'partnerIds', select: 'name code type' },
        ],
      });

      const enrichedDocs = await Promise.all(
        result.docs.map(async (p: any) => {
          const cohortCount = await Cohort.countDocuments({ programId: p._id });
          const appCount = await Application.countDocuments({ programId: p._id });
          return {
            ...p.toObject(),
            stats: {
              cohorts: cohortCount,
              applications: appCount,
            },
          };
        })
      );

      return sendSuccess(res, enrichedDocs, 'Programs retrieved', 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.pages,
      });
    }

    // Default: fetch all for admin management grid
    const programs = await Program.find(filter)
      .populate('skillAreaIds')
      .populate('partnerIds', 'name code type')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      programs.map(async (p) => {
        const cohortCount = await Cohort.countDocuments({ programId: p._id });
        const appCount = await Application.countDocuments({ programId: p._id });
        return {
          ...p.toObject(),
          stats: {
            cohorts: cohortCount,
            applications: appCount,
          },
        };
      })
    );

    sendSuccess(res, enriched);
  });

  public static getProgramById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const program = await Program.findById(id)
      .populate('skillAreaIds')
      .populate('partnerIds', 'name code type contactPerson');

    if (!program) {
      throw new AppError('Program not found', 404);
    }

    const cohorts = await Cohort.find({ programId: id })
      .populate('centreId', 'name centreCode state lga')
      .populate('skillConfigs.skillAreaId', 'name code')
      .populate('skillConfigs.trainerStaffIds', 'firstName lastName position');

    sendSuccess(res, {
      program,
      cohorts,
    });
  });

  public static createProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const program = await Program.create(req.body);
    await AuditService.log({
      req,
      action: 'PROGRAM_CREATED',
      entityType: 'Program',
      entityId: program._id.toString(),
      programId: program._id.toString(),
      afterState: program.toObject(),
    });
    sendSuccess(res, program, 'Program created successfully', 201);
  });

  public static updateProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const before = await Program.findById(id).lean();
    const updated = await Program.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      throw new AppError('Program not found', 404);
    }
    await AuditService.log({
      req,
      action: 'PROGRAM_UPDATED',
      entityType: 'Program',
      entityId: updated._id.toString(),
      programId: updated._id.toString(),
      beforeState: before || {},
      afterState: updated.toObject(),
    });
    sendSuccess(res, updated, 'Program updated');
  });

  public static deleteProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const before = await Program.findById(id).lean();
    if (!before) {
      throw new AppError('Program not found', 404);
    }

    // Check if cohorts exist
    const hasCohorts = await Cohort.exists({ programId: id });
    if (hasCohorts) {
      throw new AppError('Cannot delete program with existing cohorts. Archive it instead.', 400);
    }

    await Program.findByIdAndDelete(id);
    await AuditService.log({
      req,
      action: 'PROGRAM_DELETED',
      entityType: 'Program',
      entityId: id,
      beforeState: before,
    });
    sendSuccess(res, null, 'Program deleted successfully');
  });
}
