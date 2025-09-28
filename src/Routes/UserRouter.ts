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
        this.router.put("/update/:id",
            this.handleErrors(UserController.updateUser)
        )
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
        this.router.get("/teacher/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(UserController.addTeacher)
        );
    }
}
