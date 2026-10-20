import mongoose, { Schema } from 'mongoose';
import { IGalleryPhotoDocument } from '../interfaces/gallery.interface.js';

const GalleryPhotoSchema = new Schema<IGalleryPhotoDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: 'General' },
    location: { type: String, trim: true, default: 'Adele Training Hub' },
    date: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

GalleryPhotoSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

export const GalleryPhoto = mongoose.model<IGalleryPhotoDocument>(
  'GalleryPhoto',
  GalleryPhotoSchema
);
