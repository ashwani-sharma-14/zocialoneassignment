import cron from "node-cron";
import { AppDataSource } from "@/config/data-source.js";
import { User, OnboardingStage } from "@/model/user.model.js";
import { getOnboardingReminderContent } from "@/services/onboardingEmail.service.js";
import { sendMockEmail } from "@/services/mockEmail.service.js";

const userRepo = AppDataSource.getRepository(User);

const reminderScheduleMinutes: Record<OnboardingStage, number[]> = {
  [OnboardingStage.STAGE_0]: [24 * 60, 3 * 24 * 60, 5 * 24 * 60],
  [OnboardingStage.STAGE_1]: [12 * 60, 24 * 60],
  [OnboardingStage.STAGE_2]: [24 * 60, 1 * 24 * 60, 3 * 24 * 60, 5 * 24 * 60],
};

const getDiffMinutes = (from: Date, to: Date) => {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60));
};

const getReminderKey = (stage: OnboardingStage, reminderIndex: number) => {
  return `stage${stage}_reminder${reminderIndex}`;
};

export const runOnboardingReminderJob = async () => {
  const now = new Date();
  console.log("Running onboarding cron:", now.toISOString());

  const users = await userRepo.find({
    where: { onboardingComplete: false },
  });

  for (const user of users) {
    const stage = user.onboardingStage as OnboardingStage;

    if (
      stage !== OnboardingStage.STAGE_0 &&
      stage !== OnboardingStage.STAGE_1 &&
      stage !== OnboardingStage.STAGE_2
    ) {
      continue;
    }

    const minutesInStage = getDiffMinutes(user.onboardingStageUpdatedAt, now);
    const schedules = reminderScheduleMinutes[stage];

    for (let i = 0; i < schedules.length; i++) {
      const reminderIndex = i + 1;
      const thresholdMinutes = schedules[i] ?? Infinity;
      if (minutesInStage < thresholdMinutes) continue;
      const reminderKey = getReminderKey(stage, reminderIndex);
      if (user.onboardingReminderSent?.[reminderKey]) continue;
      const freshUser = await userRepo.findOneBy({ id: user.id });
      if (!freshUser) continue;
      if (freshUser.onboardingComplete) continue;
      if (freshUser.onboardingStage !== stage) continue;
      const { title, body } = getOnboardingReminderContent(
        stage,
        reminderIndex,
      );
      await sendMockEmail(freshUser.email, title, body);
      freshUser.onboardingReminderSent = {
        ...(freshUser.onboardingReminderSent || {}),
        [reminderKey]: true,
      };
      await userRepo.save(freshUser);
      console.log(
        `Reminder sent to ${freshUser.email} | ${reminderKey} | minutesInStage=${minutesInStage}`,
      );
    }
  }
};

export const startOnboardingReminderCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await runOnboardingReminderJob();
    } catch (err) {
      console.log("❌ Onboarding cron error:", err);
    }
  });
};
