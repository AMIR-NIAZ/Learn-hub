import { BaseEntity } from "./BaseEntity";

export interface IUser extends BaseEntity {
    name: string;
    email: string;
    role: string;
    password?: string;
}