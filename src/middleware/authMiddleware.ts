import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessTOken, type TokenPayload } from "@/lib/auth.js";
import { AppError } from "@/util/appErros.js";
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) throw new AppError("Access Token Required");

    const decoded = verifyAccessTOken(accessToken);

    if (!decoded)
      throw new AppError("You are Unauthorised for this operation", 401);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
