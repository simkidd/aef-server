import mongoose, { Document } from 'mongoose';
import { IAssessment, IAssessmentResult } from '../interfaces/assessment.interface.js';
export interface IAssessmentDocument extends Omit<IAssessment, '_id'>, Document {
}
export interface IAssessmentResultDocument extends Omit<IAssessmentResult, '_id'>, Document {
}
export declare const Assessment: mongoose.Model<IAssessmentDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAssessmentDocument, {}, {}> & IAssessmentDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const AssessmentResult: mongoose.Model<IAssessmentResultDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAssessmentResultDocument, {}, {}> & IAssessmentResultDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
