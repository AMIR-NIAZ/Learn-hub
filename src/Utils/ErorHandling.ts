import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export const errorHelper: ErrorRequestHandler = (err, req, res, next) => {
    console.error("Global error handler:", err.message);

    const status = (err as any).statusCode || 500;
    res.status(status).json({ success: false, error: err.message || "Something went wrong" });
};

