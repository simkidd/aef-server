import mongoose, { Document, Schema } from 'mongoose';
import { IOrganization } from '../interfaces/org.interface.js';

export interface IOrganizationDocument extends Omit<IOrganization, '_id'>, Document {}

const OrganizationSchema = new Schema<IOrganizationDocument>(
  {
    name: { type: String, required: true, trim: true, default: 'Adele Empowerment Foundation' },
    code: { type: String, required: true, trim: true, default: 'AEF' },
    tagline: { type: String, default: 'Building Skills, Empowering Lives' },
    description: { type: String },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    country: { type: String, default: 'Nigeria' },
    website: { type: String },
    logoUrl: { type: String },
    primaryColor: { type: String, default: '#0d9488' }, // Teal
    secondaryColor: { type: String, default: '#0f172a' }, // Slate-900
    establishedDate: { type: Date },
    registrationNumber: { type: String },
    taxId: { type: String },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganizationDocument>('Organization', OrganizationSchema);
