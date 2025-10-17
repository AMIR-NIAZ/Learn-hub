import { NextFunction, Request, Response } from "express";
import { Register } from "../Validators/RegisterValidator";
import User from "../Models/User";
import bcrypt from "bcrypt";
import { CreateToken } from "../Utils/CreateToken";
import { AppError } from "../Utils/AppError";
import UserDTO from "../Dto/UserDTO";
import Ban from "../Models/BanUser";
import Otp from "../Models/Otp";

export class UserController {
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;
        await UserController.Validation(req);
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new AppError("Email already exist", 409);
        const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });
        if (!otpDoc || otpDoc.verified == false) throw new AppError("Email not verified", 403);
        const userCount = await User.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: userCount > 0 ? "USER" : "ADMIN" });
        const userResource = UserDTO.fromUser(user)
        const token = CreateToken(user);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: userResource,
                token
            }
        });
    }

    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body
        await UserController.Validation(req)
        const isBan = await Ban.exists({ email });
        if (isBan) throw new AppError("user is ban", 409)
        let user = await User.findOne({ email })
        if (!user) throw new AppError("email is not find", 401)
        let isPasswordValidation = await bcrypt.compare(password, user.password!)
        if (!isPasswordValidation) throw new AppError("password is not valid", 401)
        const userResource = UserDTO.fromUser(user)
        const token = CreateToken(user);
        res.status(201).json({
            success: true,
            message: "User logined successfully",
            data: {
                user: userResource,
                token
            }
        });
    }

    static async updateUser(req: Request, res: Response) {
        const { name } = req.body;
        const { id } = req.params;
        const user = await User.findByValidId(id!, false);
        await UserController.Validation(req);
        await user.updateOne({ name });
        return res.status(200).json({
            success: true,
            message: "data user updated successfull"
        })
    }

    static async banUser(req: Request, res: Response) {
        const id = req.params.id;
        const user = await User.findByValidId(id!);
        if (user.role === "ADMIN") throw new AppError("cant ban admin", 403);
        await Ban.create({ email: user.email });
        return res.status(200).json({ success: true, message: "user baned successfull" });
    }

    static async getAll(req: Request, res: Response) {
        const bannedIds = await Ban.find().distinct('email');
        const allUser = await User.find({ email: { $nin: bannedIds } });
        const userDtos = UserDTO.fromUsers(allUser);
        return res.status(200).json({ success: true, users: userDtos });
    }

    static async getOneUser(req: Request, res: Response) {
        const id = req.params.id;
        const user = await User.findByValidId(id!);
        const userDto = UserDTO.fromUser(user)
        return res.status(200).json({ user: userDto })
    }

    static async addAdmin(req: any, res: Response) {
        const id = req.params.id;
        const user = await User.findByValidId(id!, false);
        if (user._id.toString() === req.user._id.toString()) throw new AppError("Admins are not allowed to change their own role.", 403)
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        await user.updateOne({ role: newRole });
        return res.status(200).json({ success: true, message: "change role" })
    }

    static async addTeacher(req: any, res: Response) {
        const id = req.params.id;
        const user = await User.findByValidId(id!, false);
        if (user._id.toString() === req.user._id.toString()) throw new AppError("You cannot change your own role.", 403);
        const newRole = user.role === "TEACHER" ? "USER" : "TEACHER";
        await user.updateOne({ role: newRole });
        return res.status(200).json({
            success: true,
            message: `Role changed to ${newRole}`
        });
    }

    private static async Validation(req: Request) {
        const validator = new Register();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);
    }
}