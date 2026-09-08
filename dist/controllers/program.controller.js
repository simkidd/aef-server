"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramController = void 0;
const program_model_js_1 = require("../models/program.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const application_model_js_1 = require("../models/application.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class ProgramController {
    // ==========================================
    // Skill Areas
    // ==========================================
    static getSkillAreas = (0, index_js_1.asyncHandler)(async (req, res) => {
        const skills = await program_model_js_1.SkillArea.find({ isActive: true }).sort({ name: 1 });
        (0, index_js_1.sendSuccess)(res, skills);
    });
    static createSkillArea = (0, index_js_1.asyncHandler)(async (req, res) => {
        const skill = await program_model_js_1.SkillArea.create(req.body);
        await audit_service_js_1.AuditService.log({
            req,
            action: 'SKILL_AREA_CREATED',
            entityType: 'SkillArea',
            entityId: skill._id.toString(),
            afterState: skill.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, skill, 'Skill Area created', 201);
    });
    static updateSkillArea = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const skill = await program_model_js_1.SkillArea.findByIdAndUpdate(id, req.body, { new: true });
        if (!skill) {
            throw new index_js_1.AppError('Skill Area not found', 404);
        }
        (0, index_js_1.sendSuccess)(res, skill, 'Skill Area updated');
    });
    // ==========================================
    // Public Program Endpoints (Beneficiaries / Public)
    // ==========================================
    static getPublishedPrograms = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { search, category, organizerType, skillAreaId } = req.query;
        const filter = {
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
        let query = program_model_js_1.Program.find(filter)
            .populate('skillAreaIds')
            .populate('partnerIds', 'name code type')
            .sort({ isFeatured: -1, createdAt: -1 });
        const programs = await query;
        // Filter by category if specified (from populated skillAreaIds)
        const filtered = category
            ? programs.filter((p) => p.skillAreaIds?.some((s) => s.category?.toLowerCase() === category.toLowerCase()))
            : programs;
        // Calculate slots and counts
        const enriched = await Promise.all(filtered.map(async (p) => {
            const cohortCount = await cohort_model_js_1.Cohort.countDocuments({
                programId: p._id,
                status: { $in: ['upcoming', 'enrolling', 'in_progress'] },
            });
            const appCount = await application_model_js_1.Application.countDocuments({ programId: p._id });
            return {
                ...p.toObject(),
                stats: {
                    cohorts: cohortCount,
                    applications: appCount,
                },
            };
        }));
        (0, index_js_1.sendSuccess)(res, enriched);
    });
    static getFeaturedPrograms = (0, index_js_1.asyncHandler)(async (req, res) => {
        const programs = await program_model_js_1.Program.find({
            published: true,
            isFeatured: true,
            status: { $in: ['active', 'enrolling', 'in_progress'] },
        })
            .populate('skillAreaIds')
            .populate('partnerIds', 'name code type')
            .sort({ createdAt: -1 })
            .limit(6);
        (0, index_js_1.sendSuccess)(res, programs);
    });
    static getPublishedProgramById = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const program = await program_model_js_1.Program.findOne({ _id: id, published: true })
            .populate('skillAreaIds')
            .populate('partnerIds', 'name code type');
        if (!program) {
            throw new index_js_1.AppError('Program not found or not published', 404);
        }
        const cohorts = await cohort_model_js_1.Cohort.find({
            programId: id,
            status: { $in: ['upcoming', 'enrolling', 'in_progress'] },
        })
            .populate('centreId', 'name centreCode state lga capacity address')
            .populate('skillConfigs.skillAreaId', 'name code category');
        (0, index_js_1.sendSuccess)(res, {
            program,
            cohorts,
        });
    });
    // ==========================================
    // Admin Program Endpoints (Protected)
    // ==========================================
    static getProgramStats = (0, index_js_1.asyncHandler)(async (req, res) => {
        const [totalPrograms, adeleOwned, partnerInitiatives, activePrograms, draftPrograms, archivedPrograms, publishedPrograms, totalApplications, totalCohorts,] = await Promise.all([
            program_model_js_1.Program.countDocuments(),
            program_model_js_1.Program.countDocuments({ organizerType: 'Adele Owned' }),
            program_model_js_1.Program.countDocuments({ organizerType: { $ne: 'Adele Owned' } }),
            program_model_js_1.Program.countDocuments({ status: { $in: ['active', 'enrolling'] } }),
            program_model_js_1.Program.countDocuments({ status: 'draft' }),
            program_model_js_1.Program.countDocuments({ status: 'archived' }),
            program_model_js_1.Program.countDocuments({ published: true }),
            application_model_js_1.Application.countDocuments(),
            cohort_model_js_1.Cohort.countDocuments(),
        ]);
        (0, index_js_1.sendSuccess)(res, {
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
    static getPrograms = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { status, published, organizerType, search, page, limit } = req.query;
        const filter = {};
        if (status)
            filter.status = status.toString().toLowerCase();
        if (published !== undefined)
            filter.published = published === 'true';
        if (organizerType)
            filter.organizerType = organizerType;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { organizerName: { $regex: search, $options: 'i' } },
            ];
        }
        // Optional pagination
        if (page && limit) {
            const result = await (0, index_js_1.paginate)(program_model_js_1.Program, filter, {
                page: page,
                limit: limit,
                sort: { createdAt: -1 },
                populate: [
                    { path: 'skillAreaIds' },
                    { path: 'partnerIds', select: 'name code type' },
                ],
            });
            const enrichedDocs = await Promise.all(result.docs.map(async (p) => {
                const cohortCount = await cohort_model_js_1.Cohort.countDocuments({ programId: p._id });
                const appCount = await application_model_js_1.Application.countDocuments({ programId: p._id });
                return {
                    ...p.toObject(),
                    stats: {
                        cohorts: cohortCount,
                        applications: appCount,
                    },
                };
            }));
            return (0, index_js_1.sendSuccess)(res, enrichedDocs, 'Programs retrieved', 200, {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.pages,
            });
        }
        // Default: fetch all for admin management grid
        const programs = await program_model_js_1.Program.find(filter)
            .populate('skillAreaIds')
            .populate('partnerIds', 'name code type')
            .sort({ createdAt: -1 });
        const enriched = await Promise.all(programs.map(async (p) => {
            const cohortCount = await cohort_model_js_1.Cohort.countDocuments({ programId: p._id });
            const appCount = await application_model_js_1.Application.countDocuments({ programId: p._id });
            return {
                ...p.toObject(),
                stats: {
                    cohorts: cohortCount,
                    applications: appCount,
                },
            };
        }));
        (0, index_js_1.sendSuccess)(res, enriched);
    });
    static getProgramById = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const program = await program_model_js_1.Program.findById(id)
            .populate('skillAreaIds')
            .populate('partnerIds', 'name code type contactPerson');
        if (!program) {
            throw new index_js_1.AppError('Program not found', 404);
        }
        const cohorts = await cohort_model_js_1.Cohort.find({ programId: id })
            .populate('centreId', 'name centreCode state lga')
            .populate('skillConfigs.skillAreaId', 'name code')
            .populate('skillConfigs.trainerStaffIds', 'firstName lastName position');
        (0, index_js_1.sendSuccess)(res, {
            program,
            cohorts,
        });
    });
    static createProgram = (0, index_js_1.asyncHandler)(async (req, res) => {
        const program = await program_model_js_1.Program.create(req.body);
        await audit_service_js_1.AuditService.log({
            req,
            action: 'PROGRAM_CREATED',
            entityType: 'Program',
            entityId: program._id.toString(),
            programId: program._id.toString(),
            afterState: program.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, program, 'Program created successfully', 201);
    });
    static updateProgram = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const before = await program_model_js_1.Program.findById(id).lean();
        const updated = await program_model_js_1.Program.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            throw new index_js_1.AppError('Program not found', 404);
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: 'PROGRAM_UPDATED',
            entityType: 'Program',
            entityId: updated._id.toString(),
            programId: updated._id.toString(),
            beforeState: before || {},
            afterState: updated.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, updated, 'Program updated');
    });
    static deleteProgram = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const before = await program_model_js_1.Program.findById(id).lean();
        if (!before) {
            throw new index_js_1.AppError('Program not found', 404);
        }
        // Check if cohorts exist
        const hasCohorts = await cohort_model_js_1.Cohort.exists({ programId: id });
        if (hasCohorts) {
            throw new index_js_1.AppError('Cannot delete program with existing cohorts. Archive it instead.', 400);
        }
        await program_model_js_1.Program.findByIdAndDelete(id);
        await audit_service_js_1.AuditService.log({
            req,
            action: 'PROGRAM_DELETED',
            entityType: 'Program',
            entityId: id,
            beforeState: before,
        });
        (0, index_js_1.sendSuccess)(res, null, 'Program deleted successfully');
    });
}
exports.ProgramController = ProgramController;
//# sourceMappingURL=program.controller.js.map