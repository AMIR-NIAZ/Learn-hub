import { Types } from "mongoose";
import { BaseEntity } from "./BaseEntity";

export interface ISession extends BaseEntity {
    title: string;
    time: Number;
    free: Boolean;
    video: String;
    course?: Types.ObjectId;
}
