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
exports.BeneficiaryProfile = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BeneficiaryProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    beneficiaryCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    stateOfOrigin: { type: String, required: true },
    lgaOfOrigin: { type: String, required: true },
    stateOfResidence: { type: String, required: true },
    lgaOfResidence: { type: String, required: true },
    highestEducation: {
        type: String,
        enum: ['None', 'Primary', 'Secondary (SSCE/WAEC)', 'OND/NCE', 'HND/BSc', 'Postgraduate', 'Vocational Certificate'],
        required: true,
    },
    employmentStatus: {
        type: String,
        enum: ['Unemployed', 'Self-Employed', 'Student', 'Employed Part-Time', 'Employed Full-Time'],
        required: true,
    },
    disabilityStatus: {
        type: String,
        enum: ['None', 'Visual', 'Hearing', 'Mobility', 'Other'],
        default: 'None',
    },
    identificationType: {
        type: String,
        enum: ['National NIN', "Voter's Card", "Driver's License", 'International Passport', 'Birth Certificate'],
    },
    identificationNumber: { type: String },
    emergencyContact: {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String },
    },
    profilePhotoUrl: { type: String },
    documents: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true },
            url: { type: String, required: true },
            verified: { type: Boolean, default: false },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
    biometricRegistered: { type: Boolean, default: false },
    biometricIdentifier: { type: String, index: true },
    activeEnrollmentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Enrollment' },
}, { timestamps: true });
exports.BeneficiaryProfile = mongoose_1.default.model('BeneficiaryProfile', BeneficiaryProfileSchema);
//# sourceMappingURL=beneficiaryProfile.model.js.map