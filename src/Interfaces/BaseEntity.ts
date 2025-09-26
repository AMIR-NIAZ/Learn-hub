import { Document } from "mongoose";

export interface BaseEntity extends Document {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}