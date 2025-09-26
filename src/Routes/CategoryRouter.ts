import { CategoryController } from "../Controllers/CategoryController";
import { AuthMiddleware } from "../Middlewares/AuthMiddleware";
import { BaseRouter } from "./BaseRouter";

export class CategoryRouter extends BaseRouter {
    protected initRoutes(): void {
        this.router.post("/create", 
            this.handleErrors(AuthMiddleware.isUser),
            this.handleErrors(AuthMiddleware.isAdmin),
            this.handleErrors(CategoryController.CreateCategory)
        )
    }
}
