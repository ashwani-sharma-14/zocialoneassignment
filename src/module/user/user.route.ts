import { Router } from "express";
import { asyncWrap } from "@/util/asyncWrap.js";
import {
  getUserProfileController,
  userLoginController,
  userOnboardingController,
  userRegisterController,
} from "./user.controller.js";
import { validate } from "@/middleware/validate.js";
import { userLoginSchema, userRegisterSchema } from "./user.validation.js";
import { authenticateToken } from "@/middleware/authMiddleware.js";
const userRouter: Router = Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema),
  asyncWrap(userRegisterController),
);
userRouter.post(
  "/login",
  validate(userLoginSchema),
  asyncWrap(userLoginController),
);
userRouter.get(
  "/profile",
  authenticateToken,
  asyncWrap(getUserProfileController),
);

userRouter.patch(
  "/socialmedia",
  authenticateToken,
  asyncWrap(userOnboardingController),
);
export default userRouter;
