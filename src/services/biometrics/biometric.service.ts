import { BeneficiaryProfile } from "../../models/beneficiaryProfile.model.js";
import {
  BiometricDevice,
  BiometricEvent,
  BiometricIdentity,
} from "../../models/biometric.model.js";
import { Enrollment } from "../../models/enrollment.model.js";
import { AttendanceEngine } from "../attendance/attendance.engine.js";
import {
  BiometricAdapterFactory,
  RawBiometricPayload,
} from "./biometric.adapter.js";

export class BiometricService {
  /**
   * Register a new biometric identity for a selected trainee
   */
  public static async registerTraineeBiometrics(params: {
    beneficiaryId: string;
    centreId: string;
    deviceId: string;
    staffId: string;
    rawSample?: any;
  }) {
    const driver = BiometricAdapterFactory.getDriver();
    const result = await driver.registerTemplate(
      params.beneficiaryId,
      params.rawSample,
    );

    // Update or create identity
    const identity = await BiometricIdentity.findOneAndUpdate(
      { beneficiaryId: params.beneficiaryId },
      {
        centreId: params.centreId,
        biometricToken: result.token,
        registeredDeviceId: params.deviceId,
        registeredByStaffId: params.staffId,
        registeredAt: new Date(),
        qualityScore: result.quality,
        isActive: true,
      },
      { upsert: true, new: true },
    );

    // Update beneficiary profile
    await BeneficiaryProfile.findByIdAndUpdate(params.beneficiaryId, {
      biometricRegistered: true,
      biometricIdentifier: result.token,
    });

    // Increment device count
    await BiometricDevice.findByIdAndUpdate(params.deviceId, {
      $inc: { registeredTemplatesCount: 1 },
      lastSyncAt: new Date(),
    });

    return identity;
  }

  /**
   * Ingest raw biometric scan event from physical hardware, kiosk, or test simulator
   */
  public static async processRawScanEvent(payload: RawBiometricPayload) {
    const timestamp = new Date(payload.timestamp || new Date());

    // 1. Locate device
    let device = await BiometricDevice.findOne({
      deviceSerial: payload.deviceSerial,
    });
    if (!device) {
      // Find default device or fallback
      device = await BiometricDevice.findOne();
      if (!device) {
        throw new Error(
          `Unregistered biometric device with serial: ${payload.deviceSerial}`,
        );
      }
    }

    // Update device heartbeat
    device.lastHeartbeat = new Date();
    await device.save();

    // 2. Lookup biometric token to identify trainee backend record
    let beneficiaryId: string | undefined;
    let beneficiary: any = null;
    let enrollment: any = null;

    // A) Try BiometricIdentity collection
    const identity = await BiometricIdentity.findOne({
      biometricToken: payload.biometricToken,
      isActive: true,
    });

    if (identity) {
      beneficiaryId = identity.beneficiaryId.toString();
      beneficiary = await BeneficiaryProfile.findById(beneficiaryId);
    }

    // B) Try BeneficiaryProfile direct identifier / code match
    if (!beneficiary) {
      beneficiary = await BeneficiaryProfile.findOne({
        $or: [
          { biometricIdentifier: payload.biometricToken },
          { beneficiaryCode: payload.biometricToken },
          {
            _id:
              payload.biometricToken.length === 24
                ? payload.biometricToken
                : undefined,
          },
        ].filter(Boolean),
      });
      if (beneficiary) {
        beneficiaryId = beneficiary._id.toString();
      }
    }

    // C) Try active enrollment in this centre/skill if simulated / laptop scan
    if (!beneficiary) {
      const centreId = payload.metadata?.centreId || device.centreId;
      const skillAreaId = payload.metadata?.skillAreaId;

      const enrollFilter: any = { status: "Active" };
      if (centreId) enrollFilter.centreId = centreId;
      if (skillAreaId && skillAreaId !== "all")
        enrollFilter.skillAreaId = skillAreaId;

      enrollment = await Enrollment.findOne(enrollFilter)
        .populate("beneficiaryId")
        .populate("skillAreaId")
        .populate("cohortId");

      if (enrollment && enrollment.beneficiaryId) {
        beneficiary = enrollment.beneficiaryId;
        beneficiaryId = (beneficiary._id || beneficiary).toString();
      }
    } else {
      enrollment = await Enrollment.findOne({
        beneficiaryId,
        status: "Active",
      })
        .populate("skillAreaId")
        .populate("cohortId");
    }

    const isMatched = !!beneficiary && !!beneficiaryId;

    // 3. Record raw event
    const event = await BiometricEvent.create({
      deviceSerial: payload.deviceSerial || device.deviceSerial,
      centreId: device.centreId,
      biometricToken: payload.biometricToken,
      scanType: payload.scanType || "IN",
      timestamp,
      isMatched,
      beneficiaryId,
      isProcessed: false,
      rawPayload: payload.metadata || {},
    });

    // 4. If matched, process attendance through AttendanceEngine
    let attendanceRecord: any = null;
    if (isMatched && beneficiaryId) {
      try {
        attendanceRecord = await AttendanceEngine.processBiometricScan({
          beneficiaryId,
          centreId: device.centreId.toString(),
          deviceId: device._id.toString(),
          scanType: (payload.scanType as any) || "IN",
          timestamp,
        });
        event.isProcessed = true;
        await event.save();
      } catch (err: any) {
        event.isProcessed = false;
        event.processingError = err.message;
        await event.save();
        console.error("[BiometricService] Attendance processing error:", err);
      }
    }

    const skillArea = enrollment?.skillAreaId || null;
    const cohort = enrollment?.cohortId || null;

    return {
      event,
      isMatched,
      beneficiaryId,
      beneficiary,
      enrollment,
      skillArea,
      cohort,
      attendanceRecord,
    };
  }
}
