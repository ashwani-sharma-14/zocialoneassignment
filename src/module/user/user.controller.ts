import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokens } from "@/lib/auth.js";
import {
  getUserProfileService,
  userLoginService,
  userOnboardingService,
  userRegisterService,
} from "./user.service.js";
import { setAuthCookie } from "@/lib/cookies.js";
import { AppError } from "@/util/appErros.js";
import type { Role } from "@/model/user.model.js";
export const userRegisterController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await userRegisterService(data);
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  };
  const { accessToken } = generateTokens(payload);
  return setAuthCookie(res, accessToken, "User Registered SuccessFully", user);
};

export const userLoginController = async (req: Request, res: Response) => {
  const data = req.body;
  const user = await userLoginService(data);
  const isMatched = await bcrypt.compare(data.password, user.password);
  if (!isMatched) {
    return res.json({
      message: "Password is wrong Please try again",
      success: true,
    });
  }

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  };
  const { accessToken } = generateTokens(payload);

  const { password, ...formatedUser } = user;
  return setAuthCookie(
    res,
    accessToken,
    "User Login SuccessFully",
    formatedUser,
  );
};

export const getUserProfileController = async (req: Request, res: Response) => {
  const email = req.user?.email as string;
  const user = await getUserProfileService(email);
  if (!user) {
    throw new AppError("No user found");
  }
  const { password, ...formatedUser } = user;
  const data = {
    id: formatedUser.id,
    name: formatedUser.name,
    email: formatedUser.email,
    createdAt: formatedUser.createdAt,
    onboardingStage: formatedUser.onboardingStage,
    totalComplaint: formatedUser.complaints?.length ?? 0,
    onboardingComplete: formatedUser.onboardingComplete,
  };
  return res
    .json({
      message: "User Found successfully",
      success: true,
      user: data,
    })
    .status(201);
};

export const userOnboardingController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.json({ message: "Unauthorised access", success: false });
  }
  const data = req.body;
  const result = await userOnboardingService(userId, data);

  return res.status(200).json({
    success: true,
    message: "Social media accounts updated successfully",
    data: result,
  });
};
