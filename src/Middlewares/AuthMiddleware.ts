import { Request, Response, NextFunction } from "express";
import { AppError } from "../Utils/AppError";
import { verifyToken } from "../Utils/CreateToken";
import User from "../Models/User";
import { Role } from "../Enums/RoleEnum";
import { isValidObjectId } from "mongoose";

export class AuthMiddleware {
    static checkRole(role: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers['authorization'];
            if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
                throw new AppError("token is not valid", 401);
            }
            const token = authHeader.split(" ")[1];
            if (!token) throw new AppError("token is not valid", 401);
            let tokenVrify = await verifyToken(token)
            if (!role.split('|').includes(tokenVrify.role) && !role.split('|').includes(Role.ANY)) {
                throw new AppError(`Access denied: ${role.split('|').join(", ")} only`, 403);
            }
            if (isValidObjectId(!tokenVrify.id)) throw new AppError("token is not valid", 401);
            let user = await User.findById(tokenVrify.id).lean();
            if (user) (req as any).user = user;
            next()
        }
    }
}