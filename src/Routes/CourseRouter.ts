import { CourseController } from "../Controllers/CourseController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import Uploder from "../Utils/Uploder";
import { BaseRouter } from "./BaseRouter";

export class CourseRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.isUser),
            // this.handleErrors(AuthMiddleware.isTeacher),
            Uploder.single("avatar"),
            this.handleErrors(CourseController.CreateCourse)
        );
    }
}
