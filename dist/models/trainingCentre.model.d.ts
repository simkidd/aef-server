import mongoose, { Document } from "mongoose";
import { ITrainingCentre, IRoomFacility, IAsset, IDocumentRecord } from "../interfaces/org.interface.js";
export interface ITrainingCentreDocument extends Omit<ITrainingCentre, "_id">, Document {
}
export interface IRoomFacilityDocument extends Omit<IRoomFacility, "_id">, Document {
}
export interface IAssetDocument extends Omit<IAsset, "_id">, Document {
}
export interface IDocumentRecordDocument extends Omit<IDocumentRecord, "_id">, Document {
}
export declare const TrainingCentre: mongoose.Model<ITrainingCentreDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingCentreDocument, {}, {}> & ITrainingCentreDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const RoomFacility: mongoose.Model<IRoomFacilityDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRoomFacilityDocument, {}, {}> & IRoomFacilityDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Asset: mongoose.Model<IAssetDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAssetDocument, {}, {}> & IAssetDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const DocumentRecord: mongoose.Model<IDocumentRecordDocument, {}, {}, {}, mongoose.Document<unknown, {}, IDocumentRecordDocument, {}, {}> & IDocumentRecordDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
