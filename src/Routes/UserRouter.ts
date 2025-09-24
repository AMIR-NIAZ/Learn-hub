import { NextFunction, Request, Response } from "express";
import { BaseRouter } from "./BaseRouter";
import { UserController } from "../Controllers/UserController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";

export class UserRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/register", UserController.registerUser);
        this.router.post("/login", UserController.loginUser);
        this.router.get("/get", AuthMiddleware.isUser, AuthMiddleware.isAdmin, UserController.getAll);
        this.router.get("/get/:id", UserController.getOneUser);
        this.router.post("/ban/:id", AuthMiddleware.isUser, AuthMiddleware.isAdmin, UserController.banUser);
    }
}
