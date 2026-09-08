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
exports.Partner = exports.Volunteer = exports.Staff = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const StaffSchema = new mongoose_1.Schema({
    staffCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'], lowercase: true, required: true },
    dateOfBirth: { type: Date },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String },
    state: { type: String },
    lga: { type: String },
    position: { type: String, required: true, trim: true },
    employmentStatus: {
        type: String,
        enum: ['active', 'on leave', 'suspended', 'terminated', 'resigned'],
        lowercase: true,
        default: 'active',
        index: true,
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'volunteer'],
        lowercase: true,
        default: 'full-time',
    },
    assignedCentreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre', index: true },
    managerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
    dateJoined: { type: Date, required: true, default: Date.now },
    dateExited: { type: Date },
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String },
    },
    hasSystemAccount: { type: Boolean, default: false },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    salaryInfo: {
        accountNumber: { type: String },
        bankName: { type: String },
        baseSalary: { type: Number },
    },
    documents: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
            type: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
    notes: { type: String },
}, { timestamps: true });
exports.Staff = mongoose_1.default.model('Staff', StaffSchema);
const VolunteerSchema = new mongoose_1.Schema({
    volunteerCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gender: { type: String, lowercase: true, required: true },
    skills: [{ type: String }],
    assignedCentreId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'TrainingCentre' },
    responsibilities: { type: String },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive', 'completed'], lowercase: true, default: 'active', index: true },
    hasSystemAccount: { type: Boolean, default: false },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    emergencyContact: {
        name: { type: String },
        relationship: { type: String },
        phone: { type: String },
    },
    notes: { type: String },
}, { timestamps: true });
exports.Volunteer = mongoose_1.default.model('Volunteer', VolunteerSchema);
const PartnerSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
    type: {
        type: String,
        enum: ['government', 'ngo', 'corporate', 'sponsor', 'training organization', 'funding agency', 'employer', 'other'],
        lowercase: true,
        required: true,
        index: true,
    },
    contactPerson: {
        name: { type: String, required: true },
        title: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    website: { type: String },
    address: { type: String },
    state: { type: String },
    country: { type: String, default: 'Nigeria' },
    status: { type: String, enum: ['active', 'prospective', 'inactive', 'archived'], lowercase: true, default: 'active', index: true },
    programsSponsored: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Program' }],
    notes: { type: String },
    documents: [
        {
            name: { type: String, required: true },
            url: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
exports.Partner = mongoose_1.default.model('Partner', PartnerSchema);
//# sourceMappingURL=staff.model.js.map