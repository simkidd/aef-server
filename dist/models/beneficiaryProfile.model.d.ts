import mongoose, { Document } from 'mongoose';
import { IBeneficiaryProfile } from '../interfaces/beneficiary.interface.js';
export interface IBeneficiaryProfileDocument extends Omit<IBeneficiaryProfile, '_id'>, Document {
}
export declare const BeneficiaryProfile: mongoose.Model<IBeneficiaryProfileDocument, {}, {}, {}, mongoose.Document<unknown, {}, IBeneficiaryProfileDocument, {}, {}> & IBeneficiaryProfileDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
