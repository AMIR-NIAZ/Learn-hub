import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";

function error(str: string) {
    try {
        return JSON.parse(str);
    } catch {
        return str;
    }
}

export const errorHelper: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.log("Global error handler:", err.message);

    const status = (err as any).statusCode || 500;
    res.status(status).json({ success: false, error: error(err.message) || "Something went wrong" });
};

