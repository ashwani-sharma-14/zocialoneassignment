import jwt, { type SignOptions } from "jsonwebtoken";
import { setAuthCookie } from "./cookies.js";
import { type Response } from "express";
import { envConfig } from "@/config/env.config.js";
import type { Role } from "@/model/user.model.js";
const accessTokenSecret = envConfig.accessSecret as string;
const accessTokenExpiry: SignOptions["expiresIn"] =
  (envConfig.accessTimeout as SignOptions["expiresIn"]) || "15m";

export interface TokenPayload extends jwt.JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });

  return { accessToken };
};

export const verifyAccessTOken = (
  token: string,
  res?: Response,
): TokenPayload | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (error: any) {
    console.error("Access Token Error:", error.message);
    if (error.name === "JsonWebTokenError" && res) {
      setAuthCookie(res, "", "User Logged Out");
    }
    return null;
  }
};
