"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const { Router } = require("express");
class BaseRouter {
    constructor() {
        this.router = Router();
        this.initRoutes();
    }
    getRouter() {
        return this.router;
    }
    handleErrors(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=BaseRouter.js.map