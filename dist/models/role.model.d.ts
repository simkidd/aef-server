import mongoose, { Document } from 'mongoose';
import { IRole, IPermission } from '../interfaces/auth.interface.js';
export interface IRoleDocument extends Omit<IRole, '_id'>, Document {
}
export interface IPermissionDocument extends Omit<IPermission, '_id'>, Document {
}
export declare const Permission: mongoose.Model<IPermissionDocument, {}, {}, {}, mongoose.Document<unknown, {}, IPermissionDocument, {}, {}> & IPermissionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Role: mongoose.Model<IRoleDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRoleDocument, {}, {}> & IRoleDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
