import { CourseController } from "../Controllers/CourseController";
import { Role } from "../Enums/RoleEnum";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import UploderCover from "../Utils/Uploder";
import UploderSession from "../Utils/UploderSession";
import { BaseRouter } from "./BaseRouter";

export class CourseRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.TEACHER}`)),
            UploderCover.single("avatar"),
            this.handleErrors(CourseController.CreateCourse)
        );
        this.router.get("/",
            this.handleErrors(CourseController.getAllCourse)
        );
        this.router.get("/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ANY}`)),
            this.handleErrors(CourseController.getCourseById)
        );
        this.router.put("/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.TEACHER}|${Role.ADMIN}`)),
            UploderCover.single("avatar"),
            this.handleErrors(CourseController.UpdateCourse)
        );
        this.router.delete("/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.TEACHER}|${Role.ADMIN}`)),
            this.handleErrors(CourseController.DeleteCourse)
        );
        this.router.post("/:id/session",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.TEACHER}`)),
            UploderSession.single("video"),
            this.handleErrors(CourseController.CreateSession)
        );
        this.router.delete("/:CourseId/session/:SessionId",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.TEACHER}`)),
            this.handleErrors(CourseController.DeleteSession)
        );
        this.router.post("/:id/comment",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.USER}`)),
            this.handleErrors(CourseController.CreateComment)
        );
        this.router.get("/comment/notactive",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(CourseController.GetAllNotActiveComments)
        );
        this.router.put("/comment/active/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(CourseController.activeComment)
        );
        this.router.delete("/comment/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.ADMIN}`)),
            this.handleErrors(CourseController.deleteComment)
        );
        this.router.post("/register/:id",
            this.handleErrors(AuthMiddleware.checkRole(`${Role.USER}`)),
            this.handleErrors(CourseController.registerUser)
        );
    }
}
