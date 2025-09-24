import { NextFunction } from "express";
declare const Router: any;
type Router = import("express").Router;
export declare abstract class BaseRouter {
    protected router: Router;
    constructor();
    protected abstract initRoutes(): void;
    getRouter(): Router;
    protected handleErrors(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
}
export {};
//# sourceMappingURL=BaseRouter.d.ts.map