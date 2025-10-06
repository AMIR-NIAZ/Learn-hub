import { CategoryController } from "../Controllers/CategoryController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { BaseRouter } from "./BaseRouter";

export class CategoryRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CategoryController.CreateCategory)
        );
        this.router.get("/:href",
            this.handleErrors(CategoryController.getCourseByCategory)
        );
        this.router.get("/",
            this.handleErrors(CategoryController.getAllCategory)
        );
        this.router.put("/update/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CategoryController.UpdateCategory)
        );
        this.router.delete("/delete/:id",
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CategoryController.DeleteCategory)
        );
    }
}
