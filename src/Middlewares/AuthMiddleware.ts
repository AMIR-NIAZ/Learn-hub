import { Request, Response, NextFunction } from "express";
import { AppError } from "../Utils/AppError";
import { verifyToken } from "../Utils/CreateToken";
import User from "../Models/User";

export class AuthMiddleware {

    static async isUser(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) throw new AppError("token is not valid", 401);
        const token = authHeader.split(" ")[1]
        if (!token) throw new AppError("token is not valid", 401);
        let tokenVrify = await verifyToken(token)
        let user = await User.findById(tokenVrify.id).lean()
        if (!user) throw new AppError("User not found", 404);
        (req as any).user = user
        next()
    }

    static async isAdmin(req: Request, res: Response, next: NextFunction) {
        const user = (req as any).user;
        if (!user) {
            throw new AppError("User not authenticated", 401);
        }
        if (user.role !== "ADMIN") {
            throw new AppError("Access denied: Admins only", 403);
        }
        next();
    }

    static async isTeacher(req: Request, res: Response, next: NextFunction) {
        const user = (req as any).user;
        if (!user) {
            throw new AppError("User not authenticated", 401);
        }
        if (user.role !== "TEACHER") {
            throw new AppError("Access denied: Teachers only", 403);
        }
        next();
    }

        static async isTeacherORAdmin(req: Request, res: Response, next: NextFunction) {
        const user = (req as any).user;
        if (!user) {
            throw new AppError("User not authenticated", 401);
        }
        if (user.role !== "TEACHER" || user.role !== "TEACHER") {
            throw new AppError("Access denied: Admins and Teacher only", 403);
        }
        next();
    }

}