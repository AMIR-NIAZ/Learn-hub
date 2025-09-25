import { NextFunction, Request, Response } from "express";
import { Register } from "../Validators/RegisterValidator";
import User from "../Models/User";
import bcrypt from "bcrypt";
import { CreateToken } from "../Utils/CreateToken";
import { AppError } from "../Utils/AppError";
import UserDTO from "../Dto/UserDTO";
import { isValidObjectId } from "mongoose";
import Ban from "../Models/BanUser";
export class UserController {
    static async registerUser(req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;

        const validator = new Register();
        const errors = await validator.validate(req.body);
        if (errors) throw new AppError(JSON.stringify(errors), 422);

        const isBan = await Ban.exists({ email });
        if (isBan) throw new AppError("user is ban", 403)

        const existingUser = await User.findOne({ email });
        if (existingUser) throw new AppError("Email already exist", 409);

        const userCount = await User.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword, role: userCount > 0 ? "USER" : "ADMIN" });
        console.log(user);

        const userResource = UserDTO.fromUser(user)
        const token = CreateToken(user);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: userResource.toObject(),
                token
            }
        });
    }

    static async loginUser(req: Request, res: Response) {
        const { email, password } = req.body

        const isBan = await Ban.exists({ email });
        if (isBan) throw new AppError("user is ban", 409)


        let user = await User.findOne({ email })
        if (!user) {
            throw new AppError("email is not find", 401)
        }

        let isPasswordValidation = await bcrypt.compare(password, user.password!)
        if (!isPasswordValidation) {
            throw new AppError("password is not valid", 401)
        }

        const token = CreateToken(user);

        return res.status(200).json({ success: true, user, token })
    }

    static async banUser(req: Request, res: Response) {
        const id = req.params.id;

        if (!isValidObjectId(id)) {
            throw new AppError("id is not true", 422);
        }

        const user = await User.findById(id).lean();
        if (!user) {
            throw new AppError("user not found", 404);
        }

        if (user.role === "ADMIN") {
            throw new AppError("cant ban admin", 403);
        }

        await Ban.create({ email: user.email });

        return res.json({ success: true });
    }

    static async getAll(req: Request, res: Response) {
        const allUser = await User.find({})
            .lean();
        const userDtos = UserDTO.fromUsers(allUser);

        return res.status(200).json({ success: true, users: userDtos.map(u => u.toObject()) })
    }

    static async getOneUser(req: Request, res: Response) {
        const id = req.params.id;

        if (!isValidObjectId(id)) {
            throw new AppError("id is not true", 422);
        }

        const user = await User.findById(id).lean();
        if (!user) {
            throw new AppError("user not found", 404);
        }
        const userDto = UserDTO.fromUser(user)
        return res.status(200).json({ user: userDto.toObject() })
    }

    static async addAdmin(req: Request, res: Response) {
        const id = req.params.id;

        const user = User.findByValidId(id ? id : "")
    }
}
