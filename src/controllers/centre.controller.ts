import { Request, Response } from 'express';
import { TrainingCentre, RoomFacility, Asset, DocumentRecord } from '../models/trainingCentre.model.js';
import { Cohort } from '../models/cohort.model.js';
import { BiometricDevice } from '../models/biometric.model.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { AuditService } from '../services/audit/audit.service.js';
import { asyncHandler, sendSuccess, AppError } from '../utils/index.js';

export class CentreController {
  // Centres
  public static getCentres = asyncHandler(async (req: Request, res: Response) => {
    const centres = await TrainingCentre.find().populate('centreManagerId', 'firstName lastName email phone').sort({ name: 1 });
    
    // Enrich with room count and active cohort count
    const enriched = await Promise.all(
      centres.map(async (c) => {
        const roomCount = await RoomFacility.countDocuments({ centreId: c._id });
        const deviceCount = await BiometricDevice.countDocuments({ centreId: c._id });
        const cohortCount = await Cohort.countDocuments({ centreId: c._id, status: { $in: ['Upcoming', 'Enrolling', 'In Progress'] } });
        return {
          ...c.toObject(),
          stats: {
            rooms: roomCount,
            devices: deviceCount,
            activeCohorts: cohortCount,
          },
        };
      })
    );

    sendSuccess(res, enriched);
  });

  public static getCentreById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const centre = await TrainingCentre.findById(id).populate('centreManagerId', 'firstName lastName email phone position');
    if (!centre) {
      throw new AppError('Training centre not found', 404);
    }
    const rooms = await RoomFacility.find({ centreId: id });
    const devices = await BiometricDevice.find({ centreId: id });
    const cohorts = await Cohort.find({ centreId: id }).populate('programId', 'title code');

    sendSuccess(res, {
      centre,
      rooms,
      devices,
      cohorts,
    });
  });

  public static createCentre = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const centre = await TrainingCentre.create(req.body);
    await AuditService.log({
      req,
      action: 'CENTRE_CREATED',
      entityType: 'TrainingCentre',
      entityId: centre._id.toString(),
      centreId: centre._id.toString(),
      afterState: centre.toObject(),
    });
    sendSuccess(res, centre, 'Training centre created successfully', 201);
  });

  public static updateCentre = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const before = await TrainingCentre.findById(id).lean();
    const updated = await TrainingCentre.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      throw new AppError('Training centre not found', 404);
    }
    await AuditService.log({
      req,
      action: 'CENTRE_UPDATED',
      entityType: 'TrainingCentre',
      entityId: updated._id.toString(),
      centreId: updated._id.toString(),
      beforeState: before || {},
      afterState: updated.toObject(),
    });
    sendSuccess(res, updated, 'Training centre updated');
  });

  // Rooms & Facilities
  public static getRooms = asyncHandler(async (req: Request, res: Response) => {
    const { centreId, type, status } = req.query;
    const filter: any = {};
    if (centreId) filter.centreId = centreId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const rooms = await RoomFacility.find(filter).populate('centreId', 'name centreCode').sort({ name: 1 });
    sendSuccess(res, rooms);
  });

  public static createRoom = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const room = await RoomFacility.create(req.body);
    sendSuccess(res, room, 'Room / Facility added', 201);
  });

  // Assets
  public static getAssets = asyncHandler(async (req: Request, res: Response) => {
    const { centreId, category, condition, status } = req.query;
    const filter: any = {};
    if (centreId) filter.centreId = centreId;
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (status) filter.status = status;

    const assets = await Asset.find(filter)
      .populate('centreId', 'name centreCode')
      .populate('roomId', 'name roomNumber')
      .populate('assignedStaffId', 'firstName lastName position')
      .sort({ assetTag: 1 });

    sendSuccess(res, assets);
  });

  public static createAsset = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const asset = await Asset.create(req.body);
    sendSuccess(res, asset, 'Asset registered', 201);
  });

  // Documents
  public static getDocuments = asyncHandler(async (req: Request, res: Response) => {
    const { category, centreId, programId } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (centreId) filter.relatedCentreId = centreId;
    if (programId) filter.relatedProgramId = programId;

    const docs = await DocumentRecord.find(filter)
      .populate('relatedCentreId', 'name')
      .populate('relatedProgramId', 'title')
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    sendSuccess(res, docs);
  });

  public static createDocument = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const doc = await DocumentRecord.create({
      ...req.body,
      uploadedBy: req.user?.userId,
    });
    sendSuccess(res, doc, 'Document uploaded and logged', 201);
  });
}
