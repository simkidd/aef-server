import mongoose, { Document } from 'mongoose';
import { IOrganization } from '../interfaces/org.interface.js';
export interface IOrganizationDocument extends Omit<IOrganization, '_id'>, Document {
}
export declare const Organization: mongoose.Model<IOrganizationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IOrganizationDocument, {}, {}> & IOrganizationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
