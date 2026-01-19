import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "@/util/appErros.js";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("Unhandled Error: ", err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
