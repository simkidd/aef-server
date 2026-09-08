"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricController = void 0;
const biometric_model_js_1 = require("../models/biometric.model.js");
const beneficiaryProfile_model_js_1 = require("../models/beneficiaryProfile.model.js");
const biometric_service_js_1 = require("../services/biometrics/biometric.service.js");
const audit_service_js_1 = require("../services/audit/audit.service.js");
const index_js_1 = require("../utils/index.js");
class BiometricController {
    // Device Management
    static getDevices = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        const devices = await biometric_model_js_1.BiometricDevice.find(filter)
            .populate("centreId", "name centreCode state lga")
            .sort({ deviceName: 1 });
        (0, index_js_1.sendSuccess)(res, devices);
    });
    static createDevice = (0, index_js_1.asyncHandler)(async (req, res) => {
        const device = await biometric_model_js_1.BiometricDevice.create(req.body);
        await audit_service_js_1.AuditService.log({
            req,
            action: "BIOMETRIC_DEVICE_REGISTERED",
            entityType: "BiometricDevice",
            entityId: device._id.toString(),
            centreId: device.centreId.toString(),
            afterState: device.toObject(),
        });
        (0, index_js_1.sendSuccess)(res, device, "Biometric device registered", 201);
    });
    // Raw Scan Ingestion (Supports physical device HTTP push or Simulator trigger)
    static handleScanWebhook = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { deviceSerial, biometricToken, scanType, timestamp, metadata } = req.body;
        if (!deviceSerial || !biometricToken) {
            throw new index_js_1.AppError("deviceSerial and biometricToken are required.", 400);
        }
        const result = await biometric_service_js_1.BiometricService.processRawScanEvent({
            deviceSerial,
            biometricToken,
            scanType: scanType || "IN",
            timestamp: timestamp || new Date(),
            metadata,
        });
        (0, index_js_1.sendSuccess)(res, result, result.isMatched
            ? "Scan processed and matched with enrolled trainee."
            : "Unknown scan recorded and flagged for review.");
    });
    // Get raw scan events & Unknown scan triage
    static getEvents = (0, index_js_1.asyncHandler)(async (req, res) => {
        const { centreId, isMatched, startDate, endDate, search, page, limit } = req.query;
        const filter = {};
        if (centreId)
            filter.centreId = centreId;
        if (isMatched !== undefined)
            filter.isMatched = isMatched === "true";
        if (startDate && endDate) {
            filter.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (search && typeof search === "string" && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            const matchedBeneficiaries = await beneficiaryProfile_model_js_1.BeneficiaryProfile.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { beneficiaryCode: searchRegex },
                    { phone: searchRegex },
                ],
            })
                .select("_id")
                .lean();
            const beneficiaryIds = matchedBeneficiaries.map((b) => b._id);
            filter.$or = [
                { deviceSerial: searchRegex },
                { biometricToken: searchRegex },
                { beneficiaryId: { $in: beneficiaryIds } },
            ];
        }
        const result = await (0, index_js_1.paginate)(biometric_model_js_1.BiometricEvent, filter, {
            page: page,
            limit: limit,
            sort: { timestamp: -1 },
            populate: [
                {
                    path: "beneficiaryId",
                    select: "firstName lastName beneficiaryCode phone",
                },
                { path: "centreId", select: "name centreCode" },
            ],
        });
        (0, index_js_1.sendSuccess)(res, result.docs, "Biometric events retrieved", 200, {
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.pages,
        });
    });
}
exports.BiometricController = BiometricController;
//# sourceMappingURL=biometric.controller.js.map