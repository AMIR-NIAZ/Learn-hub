import { BaseRouter } from "./BaseRouter";
import { UserController } from "../Controllers/UserController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { OtpController } from "../Controllers/OtpController";
import { Role } from "../Enums/RoleEnum";
export class UserRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/send-otp",
            this.handleErrors(OtpController.sendCode)
        );
        this.router.post("/verify-otp",
            this.handleErrors(OtpController.verifyOtp)
        );
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
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(UserController.getAll)
        );
        this.router.get("/get/:id",
            this.handleErrors(UserController.getOneUser)
        );
        this.router.post("/ban/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(UserController.banUser)
        );
        this.router.get("/admin/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(UserController.addAdmin)
        );
        this.router.get("/teacher/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(UserController.addTeacher)
        );
    }
}
