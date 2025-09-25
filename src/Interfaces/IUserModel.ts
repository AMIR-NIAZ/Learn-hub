import { Model } from "mongoose";
import { IUser } from "./IUser";

export interface IUserModel extends Model<IUser> {
  findByValidId(id: string): Promise<IUser>;
}
