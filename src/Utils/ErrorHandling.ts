import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHelper: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.log("Global error handler:", err.message);

    const status = (err as any).statusCode || 500;
    res.status(status).json({ success: false, error: err.message || "Something went wrong" });
};

