import mongoose, { Document } from 'mongoose';
import { ICertificate } from '../interfaces/certificate.interface.js';
export interface ICertificateDocument extends Omit<ICertificate, '_id'>, Document {
}
export declare const Certificate: mongoose.Model<ICertificateDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICertificateDocument, {}, {}> & ICertificateDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
