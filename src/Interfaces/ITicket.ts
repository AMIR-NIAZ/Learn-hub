import { Types } from "mongoose";
import { BaseEntity } from "./BaseEntity";
import { IUser } from "./IUser";

export interface ITicket extends BaseEntity {
    title: string;
    user: IUser;
    body: string;
    answer: boolean;
}
