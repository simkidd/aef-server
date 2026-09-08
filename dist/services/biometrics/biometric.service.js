"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricService = void 0;
const beneficiaryProfile_model_js_1 = require("../../models/beneficiaryProfile.model.js");
const biometric_model_js_1 = require("../../models/biometric.model.js");
const enrollment_model_js_1 = require("../../models/enrollment.model.js");
const attendance_engine_js_1 = require("../attendance/attendance.engine.js");
const biometric_adapter_js_1 = require("./biometric.adapter.js");
class BiometricService {
    /**
     * Register a new biometric identity for a selected trainee
     */
    static async registerTraineeBiometrics(params) {
        const driver = biometric_adapter_js_1.BiometricAdapterFactory.getDriver();
        const result = await driver.registerTemplate(params.beneficiaryId, params.rawSample);
        // Update or create identity
        const identity = await biometric_model_js_1.BiometricIdentity.findOneAndUpdate({ beneficiaryId: params.beneficiaryId }, {
            centreId: params.centreId,
            biometricToken: result.token,
            registeredDeviceId: params.deviceId,
            registeredByStaffId: params.staffId,
            registeredAt: new Date(),
            qualityScore: result.quality,
            isActive: true,
        }, { upsert: true, new: true });
        // Update beneficiary profile
        await beneficiaryProfile_model_js_1.BeneficiaryProfile.findByIdAndUpdate(params.beneficiaryId, {
            biometricRegistered: true,
            biometricIdentifier: result.token,
        });
        // Increment device count
        await biometric_model_js_1.BiometricDevice.findByIdAndUpdate(params.deviceId, {
            $inc: { registeredTemplatesCount: 1 },
            lastSyncAt: new Date(),
        });
        return identity;
    }
    /**
     * Ingest raw biometric scan event from physical hardware, kiosk, or test simulator
     */
    static async processRawScanEvent(payload) {
        const timestamp = new Date(payload.timestamp || new Date());
        // 1. Locate device
        let device = await biometric_model_js_1.BiometricDevice.findOne({
            deviceSerial: payload.deviceSerial,
        });
        if (!device) {
            // Find default device or fallback
            device = await biometric_model_js_1.BiometricDevice.findOne();
            if (!device) {
                throw new Error(`Unregistered biometric device with serial: ${payload.deviceSerial}`);
            }
        }
        // Update device heartbeat
        device.lastHeartbeat = new Date();
        await device.save();
        // 2. Lookup biometric token to identify trainee backend record
        let beneficiaryId;
        let beneficiary = null;
        let enrollment = null;
        // A) Try BiometricIdentity collection
        const identity = await biometric_model_js_1.BiometricIdentity.findOne({
            biometricToken: payload.biometricToken,
            isActive: true,
        });
        if (identity) {
            beneficiaryId = identity.beneficiaryId.toString();
            beneficiary = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findById(beneficiaryId);
        }
        // B) Try BeneficiaryProfile direct identifier / code match
        if (!beneficiary) {
            beneficiary = await beneficiaryProfile_model_js_1.BeneficiaryProfile.findOne({
                $or: [
                    { biometricIdentifier: payload.biometricToken },
                    { beneficiaryCode: payload.biometricToken },
                    {
                        _id: payload.biometricToken.length === 24
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
            const enrollFilter = { status: "Active" };
            if (centreId)
                enrollFilter.centreId = centreId;
            if (skillAreaId && skillAreaId !== "all")
                enrollFilter.skillAreaId = skillAreaId;
            enrollment = await enrollment_model_js_1.Enrollment.findOne(enrollFilter)
                .populate("beneficiaryId")
                .populate("skillAreaId")
                .populate("cohortId");
            if (enrollment && enrollment.beneficiaryId) {
                beneficiary = enrollment.beneficiaryId;
                beneficiaryId = (beneficiary._id || beneficiary).toString();
            }
        }
        else {
            enrollment = await enrollment_model_js_1.Enrollment.findOne({
                beneficiaryId,
                status: "Active",
            })
                .populate("skillAreaId")
                .populate("cohortId");
        }
        const isMatched = !!beneficiary && !!beneficiaryId;
        // 3. Record raw event
        const event = await biometric_model_js_1.BiometricEvent.create({
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
        let attendanceRecord = null;
        if (isMatched && beneficiaryId) {
            try {
                attendanceRecord = await attendance_engine_js_1.AttendanceEngine.processBiometricScan({
                    beneficiaryId,
                    centreId: device.centreId.toString(),
                    deviceId: device._id.toString(),
                    scanType: payload.scanType || "IN",
                    timestamp,
                });
                event.isProcessed = true;
                await event.save();
            }
            catch (err) {
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
exports.BiometricService = BiometricService;
//# sourceMappingURL=biometric.service.js.map