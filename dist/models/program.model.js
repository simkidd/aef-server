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
exports.Program = exports.SkillArea = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SkillAreaSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    category: {
        type: String,
        enum: [
            "Technical / Vocational",
            "Digital & ICT",
            "Creative Arts",
            "Renewable Energy",
            "Business & Entrepreneurship",
            "Agriculture",
            "Other",
        ],
        required: true,
        index: true,
    },
    description: { type: String, required: true },
    defaultDurationWeeks: { type: Number, required: true, default: 8 },
    certificationType: {
        type: String,
        enum: [
            "National Certification",
            "AEF Certificate of Competency",
            "Partner Joint Certificate",
            "Certificate of Participation",
        ],
        default: "AEF Certificate of Competency",
    },
    requiredFacilities: [{ type: String }],
    requiredEquipment: [{ type: String }],
    prerequisites: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });
exports.SkillArea = mongoose_1.default.model("SkillArea", SkillAreaSchema);
const ProgramSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    description: { type: String, required: true },
    organizerType: {
        type: String,
        enum: [
            "Adele Owned",
            "Government Owned",
            "NGO Partner",
            "Private Sector",
            "Joint Venture",
        ],
        required: true,
        index: true,
    },
    organizerName: { type: String, required: true, trim: true },
    partnerIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Partner" }],
    deliveryRole: {
        type: String,
        enum: [
            "Primary Host",
            "Accredited Training Centre",
            "Consortium Partner",
            "Co-host",
            "Accredited Facilitator",
            "Partner Funded",
        ],
        default: "Primary Host",
    },
    status: {
        type: String,
        enum: [
            "draft",
            "active",
            "enrolling",
            "in_progress",
            "completed",
            "archived",
        ],
        lowercase: true,
        default: "draft",
        index: true,
    },
    skillAreaIds: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "SkillArea", required: true },
    ],
    eligibilityCriteria: [{ type: String }],
    requirements: [{ type: String }],
    maxSlots: { type: Number, default: 100 },
    applicationStartDate: { type: Date },
    applicationDeadline: { type: Date },
    trainingStartDate: { type: Date },
    trainingEndDate: { type: Date },
    imageUrl: { type: String },
    bannerUrl: { type: String },
    isFeatured: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    notes: { type: String },
}, { timestamps: true });
exports.Program = mongoose_1.default.model("Program", ProgramSchema);
//# sourceMappingURL=program.model.js.map