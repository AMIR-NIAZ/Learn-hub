import { Document, Types } from "mongoose";
import { IUser } from "./IUser";
import { ICategory } from "./ICategory";

export interface ICourse extends Document {
    avatar: string;
    title: string;
    description: string;
    price: number;
    status: string;
    time: number;
    lastUpdate: string;
    href: string;
    teacher: Types.ObjectId | IUser;
    category: Types.ObjectId | ICategory;
    createdAt: Date;
    updatedAt: Date;
}
