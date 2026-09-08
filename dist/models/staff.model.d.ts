import mongoose, { Document } from 'mongoose';
import { IStaff, IVolunteer, IPartner } from '../interfaces/org.interface.js';
export interface IStaffDocument extends Omit<IStaff, '_id'>, Document {
}
export interface IVolunteerDocument extends Omit<IVolunteer, '_id'>, Document {
}
export interface IPartnerDocument extends Omit<IPartner, '_id'>, Document {
}
export declare const Staff: mongoose.Model<IStaffDocument, {}, {}, {}, mongoose.Document<unknown, {}, IStaffDocument, {}, {}> & IStaffDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Volunteer: mongoose.Model<IVolunteerDocument, {}, {}, {}, mongoose.Document<unknown, {}, IVolunteerDocument, {}, {}> & IVolunteerDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Partner: mongoose.Model<IPartnerDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPartnerDocument, {}, {}> & IPartnerDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
