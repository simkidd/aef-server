import mongoose, { Document } from 'mongoose';
import { IAttendancePolicy, IAttendanceRecord, IAttendanceCorrection } from '../interfaces/attendance.interface.js';
export interface IAttendancePolicyDocument extends Omit<IAttendancePolicy, '_id'>, Document {
}
export interface IAttendanceRecordDocument extends Omit<IAttendanceRecord, '_id'>, Document {
}
export interface IAttendanceCorrectionDocument extends Omit<IAttendanceCorrection, '_id'>, Document {
}
export declare const AttendancePolicy: mongoose.Model<IAttendancePolicyDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAttendancePolicyDocument, {}, {}> & IAttendancePolicyDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const AttendanceRecord: mongoose.Model<IAttendanceRecordDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAttendanceRecordDocument, {}, {}> & IAttendanceRecordDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const AttendanceCorrection: mongoose.Model<IAttendanceCorrectionDocument, {}, {}, {}, mongoose.Document<unknown, {}, IAttendanceCorrectionDocument, {}, {}> & IAttendanceCorrectionDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
