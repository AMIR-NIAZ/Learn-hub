import { Document, Types } from "mongoose";
import { BaseEntity } from "./BaseEntity";

export interface IComment extends BaseEntity {
    body: string;
    course: Types.ObjectId;
    user: Types.ObjectId;
    isActive: boolean;
    score: number;
    parent?: Types.ObjectId | null;
    date: string;
}
