import mongoose, { Document } from "mongoose";
import { ICohort, ITrainingSession, ITrainingCalendarEvent } from "../interfaces/program.interface.js";
export interface ICohortDocument extends Omit<ICohort, "_id">, Document {
}
export interface ITrainingSessionDocument extends Omit<ITrainingSession, "_id">, Document {
}
export interface ITrainingCalendarEventDocument extends Omit<ITrainingCalendarEvent, "_id">, Document {
}
export declare const Cohort: mongoose.Model<ICohortDocument, {}, {}, {}, mongoose.Document<unknown, {}, ICohortDocument, {}, {}> & ICohortDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const TrainingSession: mongoose.Model<ITrainingSessionDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingSessionDocument, {}, {}> & ITrainingSessionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const TrainingCalendarEvent: mongoose.Model<ITrainingCalendarEventDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITrainingCalendarEventDocument, {}, {}> & ITrainingCalendarEventDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
