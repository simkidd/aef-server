"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiometricEvent = exports.BiometricIdentity = exports.BiometricDevice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_js_1 = require("../constants/enums.js");
const BiometricDeviceSchema = new mongoose_1.Schema({
    deviceName: { type: String, required: true, trim: true },
    deviceSerial: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    locationDescription: { type: String, required: true },
    model: {
        type: String,
        required: true,
        default: "AEF-OptiScan 5000 Pro (Fingerprint)",
    },
    deviceType: {
        type: String,
        enum: ["Fingerprint"],
        default: "Fingerprint",
    },
    ipAddress: { type: String },
    status: {
        type: String,
        enum: ["Online", "Offline", "Syncing", "Maintenance"],
        default: "Online",
    },
    lastHeartbeat: { type: Date, default: Date.now },
    lastSyncAt: { type: Date, default: Date.now },
    registeredTemplatesCount: { type: Number, default: 0 },
    apiKey: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.BiometricDevice = mongoose_1.default.model("BiometricDevice", BiometricDeviceSchema);
const BiometricIdentitySchema = new mongoose_1.Schema({
    beneficiaryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BeneficiaryProfile",
        required: true,
        unique: true,
        index: true,
    },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    biometricToken: { type: String, required: true, unique: true, index: true },
    registeredDeviceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BiometricDevice",
        required: true,
    },
    registeredByStaffId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    },
    registeredAt: { type: Date, default: Date.now },
    qualityScore: { type: Number, default: 98 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.BiometricIdentity = mongoose_1.default.model("BiometricIdentity", BiometricIdentitySchema);
const BiometricEventSchema = new mongoose_1.Schema({
    deviceSerial: { type: String, required: true, index: true },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    biometricToken: { type: String, required: true, index: true },
    scanType: {
        type: String,
        enum: Object.values(enums_js_1.BiometricScanType),
        required: true,
        default: enums_js_1.BiometricScanType.IN,
    },
    timestamp: { type: Date, required: true, default: Date.now, index: true },
    isMatched: { type: Boolean, default: false, index: true },
    beneficiaryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BeneficiaryProfile",
        index: true,
    },
    isProcessed: { type: Boolean, default: false, index: true },
    processingError: { type: String },
    rawPayload: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true });
exports.BiometricEvent = mongoose_1.default.model("BiometricEvent", BiometricEventSchema);
//# sourceMappingURL=biometric.model.js.map