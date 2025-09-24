import { UserRouter } from "./Routes/UserRouter";
import { errorHelper } from "./Utils/ErorHandling";

const express = require("express");
type Application = import("express").Application;
const cors = require("cors");
const { Logger } = require("./Utils/logger");

export class App {
    public app: Application

    constructor() {
        this.app = express();
        this.Middleware();
        this.Route()
        this.ErrorHandling()
    }

    private Middleware() {
        this.app.use(cors())
        this.app.use(Logger)
        this.app.use(express.json());
    }
    private Route() {
        let instans = new UserRouter()
        this.app.use("/api/user/", instans.getRouter())
    }

    private ErrorHandling () {
        this.app.use(errorHelper);
    }
}
