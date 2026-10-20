import { Document, Types } from 'mongoose';
export interface IGalleryPhoto {
    title: string;
    description?: string;
    imageUrl: string;
    publicId: string;
    category: string;
    location?: string;
    date?: string;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder?: number;
    uploadedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IGalleryPhotoDocument extends Omit<IGalleryPhoto, '_id'>, Document {
}
