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
exports.DocumentRecord = exports.Asset = exports.RoomFacility = exports.TrainingCentre = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const TrainingCentreSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    centreCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    address: { type: String, required: true },
    state: { type: String, required: true, index: true },
    lga: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true },
    centreManagerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    capacity: { type: Number, required: true, default: 100 },
    status: {
        type: String,
        enum: ["active", "under maintenance", "closed", "planned"],
        lowercase: true,
        default: "active",
        index: true,
    },
    accreditationDetails: {
        accreditedBy: { type: String },
        accreditationNumber: { type: String },
        validUntil: { type: Date },
    },
    geoCoordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    notes: { type: String },
}, { timestamps: true });
exports.TrainingCentre = mongoose_1.default.model("TrainingCentre", TrainingCentreSchema);
const RoomFacilitySchema = new mongoose_1.Schema({
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        required: true,
        index: true,
    },
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String },
    type: {
        type: String,
        enum: [
            "classroom",
            "workshop",
            "computer lab",
            "practical bay",
            "conference room",
            "other",
        ],
        lowercase: true,
        required: true,
        index: true,
    },
    capacity: { type: Number, required: true, default: 30 },
    equipment: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["operational", "maintenance", "decommissioned"],
        lowercase: true,
        default: "operational",
        index: true,
    },
    notes: { type: String },
}, { timestamps: true });
exports.RoomFacility = mongoose_1.default.model("RoomFacility", RoomFacilitySchema);
const AssetSchema = new mongoose_1.Schema({
    assetTag: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: [
            "it equipment",
            "solar hardware",
            "welding & machinery",
            "plumbing tools",
            "vehicle",
            "furniture",
            "biometric scanner",
            "other",
        ],
        lowercase: true,
        required: true,
        index: true,
    },
    centreId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TrainingCentre",
        index: true,
    },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "RoomFacility" },
    assignedStaffId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Staff" },
    condition: {
        type: String,
        enum: [
            "excellent",
            "good",
            "fair",
            "needs repair",
            "damaged",
            "disposed",
        ],
        lowercase: true,
        default: "good",
    },
    status: {
        type: String,
        enum: ["in use", "in storage", "under repair", "retired"],
        lowercase: true,
        default: "in use",
        index: true,
    },
    purchaseDate: { type: Date },
    purchaseCost: { type: Number },
    serialNumber: { type: String },
    supplier: { type: String },
    maintenanceHistory: [
        {
            date: { type: Date, default: Date.now },
            description: { type: String, required: true },
            cost: { type: Number },
            performedBy: { type: String, required: true },
        },
    ],
}, { timestamps: true });
exports.Asset = mongoose_1.default.model("Asset", AssetSchema);
const DocumentRecordSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: [
            "accreditation",
            "policy",
            "partner agreement",
            "staff document",
            "centre document",
            "program curriculum",
            "general",
        ],
        lowercase: true,
        required: true,
        index: true,
    },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    isPublic: { type: Boolean, default: false },
    requiredPermission: { type: String },
    relatedCentreId: { type: mongoose_1.Schema.Types.ObjectId, ref: "TrainingCentre" },
    relatedProgramId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program" },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
exports.DocumentRecord = mongoose_1.default.model("DocumentRecord", DocumentRecordSchema);
//# sourceMappingURL=trainingCentre.model.js.map