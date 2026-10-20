import mongoose from 'mongoose';
import { IGalleryPhotoDocument } from '../interfaces/gallery.interface.js';
export declare const GalleryPhoto: mongoose.Model<IGalleryPhotoDocument, {}, {}, {}, mongoose.Document<unknown, {}, IGalleryPhotoDocument, {}, {}> & IGalleryPhotoDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
