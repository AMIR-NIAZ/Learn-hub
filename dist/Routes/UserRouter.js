"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const BaseRouter_1 = require("./BaseRouter");
class UserRouter extends BaseRouter_1.BaseRouter {
    initRoutes() {
        this.router.get('/', (req, res) => {
            res.send('Hello, TypeScript Express!');
        });
    }
}
exports.UserRouter = UserRouter;
//# sourceMappingURL=UserRouter.js.map