import mongoose, { Document } from "mongoose";
import { IApplication } from "../interfaces/beneficiary.interface.js";
export interface IApplicationDocument extends Omit<IApplication, "_id">, Document {
}
export declare const Application: mongoose.Model<IApplicationDocument, {}, {}, {}, mongoose.Document<unknown, {}, IApplicationDocument, {}, {}> & IApplicationDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
