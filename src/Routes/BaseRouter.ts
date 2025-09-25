import { NextFunction, Request, Response } from "express";

const { Router } = require("express");
type Router = import("express").Router;
export abstract class BaseRouter {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  protected abstract initRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }

  protected handleErrors(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }
}
