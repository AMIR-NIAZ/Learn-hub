import { NextFunction, Request, Response } from "express";
import { BaseRouter } from "./BaseRouter";
import { UserController } from "../Controllers/UserController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
export class UserRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/register",
            this.handleErrors(UserController.registerUser)
        );
        this.router.post("/login",
            this.handleErrors(UserController.loginUser)
        );
        this.router.get("/get",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(UserController.getAll)
        );
        this.router.get("/get/:id",
            this.handleErrors(UserController.getOneUser)
        );
        this.router.post("/ban/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(UserController.banUser)
        );

        this.router.get("/admin/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(UserController.addAdmin)
        );
    }
}
