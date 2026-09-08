import mongoose, { Document } from 'mongoose';
import { IEnrollment } from '../interfaces/beneficiary.interface.js';
export interface IEnrollmentDocument extends Omit<IEnrollment, '_id'>, Document {
}
export declare const Enrollment: mongoose.Model<IEnrollmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollmentDocument, {}, {}> & IEnrollmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
