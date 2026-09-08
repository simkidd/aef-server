import mongoose, { Document } from "mongoose";
import { ISkillArea, IProgram } from "../interfaces/program.interface.js";
export interface ISkillAreaDocument extends Omit<ISkillArea, "_id">, Document {
}
export interface IProgramDocument extends Omit<IProgram, "_id">, Document {
}
export declare const SkillArea: mongoose.Model<ISkillAreaDocument, {}, {}, {}, mongoose.Document<unknown, {}, ISkillAreaDocument, {}, {}> & ISkillAreaDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const Program: mongoose.Model<IProgramDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProgramDocument, {}, {}> & IProgramDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
