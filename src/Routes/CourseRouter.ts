import { CourseController } from "../Controllers/CourseController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import Uploder from "../Utils/Uploder";
import { BaseRouter } from "./BaseRouter";

export class CourseRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            Uploder.single("avatar"),
            this.handleErrors(CourseController.CreateCourse)
        );
        this.router.get("/",
            this.handleErrors(CourseController.getAllCourse)
        );
        this.router.get("/:id",
            this.handleErrors(CourseController.getCourseById)
        );
        this.router.put("/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            Uploder.single("avatar"),
            this.handleErrors(CourseController.UpdateCourse)
        );
        this.router.delete("/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            this.handleErrors(CourseController.DeleteCourse)
        );
    }
}
