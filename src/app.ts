import { UserRouter } from "./Routes/UserRouter";
import { errorHelper } from "./Utils/ErrorHandling";
import express, { Application } from "express";
import cors from "cors";
import { Logger } from "./Utils/logger";
import { CategoryRouter } from "./Routes/CategoryRouter";
import path from "path";
import { CourseRouter } from "./Routes/CourseRouter";

export class App {
    public app: Application

    constructor() {
        this.app = express();
        this.Middleware();
        this.Route();
        this.ErrorHandling();
    }

    private Middleware() {
        this.app.use(cors());
        this.app.use(Logger);
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(express.json());
    }

    private Route() {
        let userInstans = new UserRouter();
        let categoryInstans = new CategoryRouter();
        let courseInstans = new CourseRouter();
        this.app.use("/api/user/", userInstans.getRouter());
        this.app.use("/api/category/", categoryInstans.getRouter());
        this.app.use("/api/course/", courseInstans.getRouter());
    }

    private ErrorHandling () {
        this.app.use(errorHelper);
    }
}
