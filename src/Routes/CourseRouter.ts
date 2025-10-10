import { CourseController } from "../Controllers/CourseController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import UploderCover from "../Utils/Uploder";
import UploderSession from "../Utils/UploderSession";
import { BaseRouter } from "./BaseRouter";

export class CourseRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            UploderCover.single("avatar"),
            this.handleErrors(CourseController.CreateCourse)
        );
        this.router.get("/",
            this.handleErrors(CourseController.getAllCourse)
        );
        this.router.get("/:id",
            this.handleErrors(AuthMiddleware.getUser),
            this.handleErrors(CourseController.getCourseById)
        );
        this.router.put("/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacherORAdmin),
            UploderCover.single("avatar"),
            this.handleErrors(CourseController.UpdateCourse)
        );
        this.router.delete("/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacherORAdmin),
            this.handleErrors(CourseController.DeleteCourse)
        );
        this.router.post("/:id/session",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            UploderSession.single("video"),
            this.handleErrors(CourseController.CreateSession)
        );
        this.router.delete("/:CourseId/session/:SessionId",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isTeacher),
            this.handleErrors(CourseController.DeleteSession)
        );
        this.router.post("/:id/comment",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(CourseController.CreateComment)
        );
        this.router.get("/comment/notactive",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CourseController.GetAllNotActiveComments)
        );
        this.router.put("/comment/active/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CourseController.activeComment)
        );
        this.router.delete("/comment/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CourseController.deleteComment)
        );
        this.router.get("/:id/comment",
            this.handleErrors(CourseController.getAllCommentByCourse)
        );
        this.router.post("/register/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(CourseController.registerUser)
        );
    }
}
