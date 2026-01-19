import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod/v4";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  };
