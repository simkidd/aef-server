import { Request, Response } from "express";
import { BiometricDevice, BiometricEvent } from "../models/biometric.model.js";
import { BeneficiaryProfile } from "../models/beneficiaryProfile.model.js";
import { BiometricService } from "../services/biometrics/biometric.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { AuditService } from "../services/audit/audit.service.js";
import {
  asyncHandler,
  sendSuccess,
  AppError,
  paginate,
} from "../utils/index.js";

export class BiometricController {
  // Device Management
  public static getDevices = asyncHandler(
    async (req: Request, res: Response) => {
      const { centreId } = req.query;
      const filter: any = {};
      if (centreId) filter.centreId = centreId;

      const devices = await BiometricDevice.find(filter)
        .populate("centreId", "name centreCode state lga")
        .sort({ deviceName: 1 });
      sendSuccess(res, devices);
    },
  );

  public static createDevice = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const device = await BiometricDevice.create(req.body);
      await AuditService.log({
        req,
        action: "BIOMETRIC_DEVICE_REGISTERED",
        entityType: "BiometricDevice",
        entityId: device._id.toString(),
        centreId: device.centreId.toString(),
        afterState: device.toObject(),
      });
      sendSuccess(res, device, "Biometric device registered", 201);
    },
  );

  // Raw Scan Ingestion (Supports physical device HTTP push or Simulator trigger)
  public static handleScanWebhook = asyncHandler(
    async (req: Request, res: Response) => {
      const { deviceSerial, biometricToken, scanType, timestamp, metadata } =
        req.body;

      if (!deviceSerial || !biometricToken) {
        throw new AppError(
          "deviceSerial and biometricToken are required.",
          400,
        );
      }

      const result = await BiometricService.processRawScanEvent({
        deviceSerial,
        biometricToken,
        scanType: scanType || "IN",
        timestamp: timestamp || new Date(),
        metadata,
      });

      sendSuccess(
        res,
        result,
        result.isMatched
          ? "Scan processed and matched with enrolled trainee."
          : "Unknown scan recorded and flagged for review.",
      );
    },
  );

  // Get raw scan events & Unknown scan triage
  public static getEvents = asyncHandler(
    async (req: Request, res: Response) => {
      const { centreId, isMatched, startDate, endDate, search, page, limit } =
        req.query;
      const filter: any = {};
      if (centreId) filter.centreId = centreId;
      if (isMatched !== undefined) filter.isMatched = isMatched === "true";
      if (startDate && endDate) {
        filter.timestamp = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      if (search && typeof search === "string" && search.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");

        const matchedBeneficiaries = await BeneficiaryProfile.find({
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

      const result = await paginate(BiometricEvent, filter, {
        page: page as string,
        limit: limit as string,
        sort: { timestamp: -1 },
        populate: [
          {
            path: "beneficiaryId",
            select: "firstName lastName beneficiaryCode phone",
          },
          { path: "centreId", select: "name centreCode" },
        ],
      });

      sendSuccess(res, result.docs, "Biometric events retrieved", 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.pages,
      });
    },
  );
}
