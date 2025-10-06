import { Document, Types } from "mongoose";
import { IUser } from "./IUser";
import { ICategory } from "./ICategory";
import { ISession } from "./ISession";
import { IComment } from "./IComment";

export interface ICourse extends Document {
    avatar: string;
    title: string;
    description: string;
    price: number;
    status: string;
    time: number;
    lastUpdate: string;
    href: string;
    teacher?: Types.ObjectId | IUser;
    category?: Types.ObjectId | ICategory;
    sessions?: ISession[];
    comments?: IComment[];
    createdAt: Date;
    updatedAt: Date;
}
