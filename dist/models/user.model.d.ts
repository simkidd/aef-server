import mongoose, { Document } from 'mongoose';
import { IUser } from '../interfaces/auth.interface.js';
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
}
export declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
