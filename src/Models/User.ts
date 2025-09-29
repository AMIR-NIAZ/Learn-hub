import mongoose, { isValidObjectId, Types } from "mongoose";
import { AppError } from "../Utils/AppError";
import { IUser } from "../Interfaces/IUser";
import { IUserModel } from "../Interfaces/IUserModel";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "USER",
        enum: ["ADMIN", "TEACHER", "USER"]
    }
}, { timestamps: true })


UserSchema.statics.findByValidId = async function (id: string, useLean = true) {
    if (!isValidObjectId(id)) {
        throw new AppError("id is not true", 422);
    }
    const query = this.findById(id);
    const user = useLean ? await query.lean() : await query;

    if (!user) {
        throw new AppError("user not found", 404);
    }
    return user;
};

const User = mongoose.model<IUser, IUserModel>("User", UserSchema)
export default User