"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CentreController = void 0;
const trainingCentre_model_js_1 = require("../models/trainingCentre.model.js");
const cohort_model_js_1 = require("../models/cohort.model.js");
const biometric_model_js_1 = require("../models/biometric.model.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class CentreController {
    // Centres
    static getCentres = (0, index_js_1.asyncHandler)(async (req, res) => {
        const centres = await trainingCentre_model_js_1.TrainingCentre.find().populate('centreManagerId', 'firstName lastName email phone').sort({ name: 1 });
        // Enrich with room count and active cohort count
        const enriched = await Promise.all(centres.map(async (c) => {
            const roomCount = await trainingCentre_model_js_1.RoomFacility.countDocuments({ centreId: c._id });
            const deviceCount = await biometric_model_js_1.BiometricDevice.countDocuments({ centreId: c._id });
            const cohortCount = await cohort_model_js_1.Cohort.countDocuments({ centreId: c._id, status: { $in: ['Upcoming', 'Enrolling', 'In Progress'] } });
            return {
                ...c.toObject(),
                stats: {
                    rooms: roomCount,
                    devices: deviceCount,
                    activeCohorts: cohortCount,
                },
            };
        }));
        (0, index_js_1.sendSuccess)(res, enriched);
    });
    static getCentreById = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const centre = await trainingCentre_model_js_1.TrainingCentre.findById(id).populate('centreManagerId', 'firstName lastName email phone position');
        if (!centre) {
            throw new index_js_1.AppError('Training centre not found', 404);
        }
        const rooms = await trainingCentre_model_js_1.RoomFacility.find({ centreId: id });
        const devices = await biometric_model_js_1.BiometricDevice.find({ centreId: id });
        const cohorts = await cohort_model_js_1.Cohort.find({ centreId: id }).populate('programId', 'title code');
        (0, index_js_1.sendSuccess)(res, {
            centre,
            rooms,
            devices,
            cohorts,
        });
    });
    static createCentre = (0, index_js_1.asyncHandler)(async (req, res) => {
        const centre = await trainingCentre_model_js_1.TrainingCentre.create(req.body);
        await audit_service_js_1.AuditService.log({
            req,
            action: 'CENTRE_CREATED',
            entityType: 'TrainingCentre',
            entityId: centre._id.toString(),
            centreId: centre._id.toString(),
            afterState: centre.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, centre, 'Training centre created successfully', 201);
    });
    static updateCentre = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const before = await trainingCentre_model_js_1.TrainingCentre.findById(id).lean();
        const updated = await trainingCentre_model_js_1.TrainingCentre.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            throw new index_js_1.AppError('Training centre not found', 404);
        }
        await audit_service_js_1.AuditService.log({
            req,
            action: 'CENTRE_UPDATED',
            entityType: 'TrainingCentre',
            entityId: updated._id.toString(),
            centreId: updated._id.toString(),
            beforeState: before || {},
            afterState: updated.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, updated, 'Training centre updated');
    });
    // Rooms & Facilities
    static getRooms = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, type, status } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        const rooms = await trainingCentre_model_js_1.RoomFacility.find(filter).populate('centreId', 'name centreCode').sort({ name: 1 });
        (0, index_js_1.sendSuccess)(res, rooms);
    });
    static createRoom = (0, index_js_1.asyncHandler)(async (req, res) => {
        const room = await trainingCentre_model_js_1.RoomFacility.create(req.body);
        (0, index_js_1.sendSuccess)(res, room, 'Room / Facility added', 201);
    });
    // Assets
    static getAssets = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, category, condition, status } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        if (category)
            filter.category = category;
        if (condition)
            filter.condition = condition;
        if (status)
            filter.status = status;
        const assets = await trainingCentre_model_js_1.Asset.find(filter)
            .populate('centreId', 'name centreCode')
            .populate('roomId', 'name roomNumber')
            .populate('assignedStaffId', 'firstName lastName position')
            .sort({ assetTag: 1 });
        (0, index_js_1.sendSuccess)(res, assets);
    });
    static createAsset = (0, index_js_1.asyncHandler)(async (req, res) => {
        const asset = await trainingCentre_model_js_1.Asset.create(req.body);
        (0, index_js_1.sendSuccess)(res, asset, 'Asset registered', 201);
    });
    // Documents
    static getDocuments = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { category, centreId, programId } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (centreId)
            filter.relatedCentreId = centreId;
        if (programId)
            filter.relatedProgramId = programId;
        const docs = await trainingCentre_model_js_1.DocumentRecord.find(filter)
            .populate('relatedCentreId', 'name')
            .populate('relatedProgramId', 'title')
            .populate('uploadedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        (0, index_js_1.sendSuccess)(res, docs);
    });
    static createDocument = (0, index_js_1.asyncHandler)(async (req, res) => {
        const doc = await trainingCentre_model_js_1.DocumentRecord.create({
            ...req.body,
            uploadedBy: req.user?.userId,
        });
        (0, index_js_1.sendSuccess)(res, doc, 'Document uploaded and logged', 201);
    });
}
exports.CentreController = CentreController;
//# sourceMappingURL=centre.controller.js.map