"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const UserRouter_1 = require("./Routes/UserRouter");
const express = require("express");
const cors = require("cors");
const { Logger } = require("./Utils/logger");
require("dotenv").config();
class App {
    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || 5000;
        this.Middleware();
        this.Route();
    }
    Middleware() {
        this.app.use(cors());
        this.app.use(Logger);
    }
    Route() {
        let instans = new UserRouter_1.UserRouter();
        this.app.use("/api/", instans.getRouter());
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map