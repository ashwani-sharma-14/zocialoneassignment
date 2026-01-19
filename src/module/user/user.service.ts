import { AppDataSource } from "@/config/data-source.js";
import { OnboardingStage, User } from "@/model/user.model.js";
import { AppError } from "@/util/appErros.js";
const userRepo = AppDataSource.getRepository(User);
import bcrypt from "bcryptjs";
import type { UpdateSocialAccountsDTO } from "./user.types.js";
import { tr } from "zod/locales";
interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}
interface LoginUserDTo {
  email: string;
  password: string;
}
export const userRegisterService = async (data: RegisterUserDTO) => {
  let user = await userRepo.findOneBy({ email: data.email });
  if (user) {
    throw new AppError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;
  const createdUser = userRepo.create(data);
  user = await userRepo.save(createdUser);
  if (!user) {
    throw new AppError("failed to create error");
  }
  const { password, ...formatedUser } = user;
  return formatedUser;
};

export const userLoginService = async (data: LoginUserDTo) => {
  const user = await userRepo.findOneBy({ email: data.email });
  if (!user) throw new AppError("User Not found");
  return user;
};

export const getUserProfileService = async (email: string) => {
  const user = await userRepo.findOne({
    where: { email: email },
    relations: { complaints: true },
  });
  if (!user) throw new AppError("User Not found");
  return user;
};

const computeOnboarding = (accounts: User["socialAccounts"]) => {
  const connectedCount = Object.values(accounts).filter(
    (v) => typeof v === "string" && v.trim().length > 0,
  ).length;

  if (connectedCount === 0) {
    return { stage: OnboardingStage.STAGE_0, complete: false };
  }
  if (connectedCount === 1) {
    return { stage: OnboardingStage.STAGE_1, complete: false };
  }
  if (connectedCount === 2) {
    return { stage: OnboardingStage.STAGE_2, complete: false };
  }

  return { stage: OnboardingStage.STAGE_2, complete: true };
};

export const userOnboardingService = async (
  userId: string,
  payload: UpdateSocialAccountsDTO,
) => {
  const user = await userRepo.findOneBy({ id: userId });

  if (!user) {
    throw new AppError("User not found");
  }

  const updatedAccounts: User["socialAccounts"] = {
    ...user.socialAccounts,
    ...payload,
  };

  const { stage: newStage, complete } = computeOnboarding(updatedAccounts);

  const stageChanged = user.onboardingStage !== newStage;

  user.socialAccounts = updatedAccounts;
  user.onboardingStage = newStage;
  user.onboardingComplete = complete;

  if (stageChanged) {
    user.onboardingStageUpdatedAt = new Date();
  }

  await userRepo.save(user);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    onboardingStage: user.onboardingStage,
    onboardingComplete: user.onboardingComplete,
    onboardingStageUpdatedAt: user.onboardingStageUpdatedAt,
    socialAccounts: user.socialAccounts,
  };
};
