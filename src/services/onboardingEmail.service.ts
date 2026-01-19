import { OnboardingStage } from "@/model/user.model.js";

export const getOnboardingReminderContent = (
  stage: OnboardingStage,
  reminderIndex: number,
) => {
  if (stage === OnboardingStage.STAGE_0) {
    if (reminderIndex === 1) {
      return {
        title: "Welcome to ZocialOne!",
        body: "Complete your setup by connecting your first social account.",
      };
    }
    if (reminderIndex === 2) {
      return {
        title: "Reminder: Setup pending",
        body: "Connect Instagram/Facebook/LinkedIn to start posting content.",
      };
    }
    return {
      title: "Final reminder for onboarding",
      body: "Finish onboarding to unlock full marketing tools.",
    };
  }

  if (stage === OnboardingStage.STAGE_1) {
    if (reminderIndex === 1) {
      return {
        title: "Good start!",
        body: "Connect one more social platform to reach more customers.",
      };
    }
    return {
      title: " Complete onboarding",
      body: "You’re close! Add another platform to finish setup.",
    };
  }

  if (stage === OnboardingStage.STAGE_2) {
    if (reminderIndex === 1) {
      return {
        title: "Almost done!",
        body: "Complete onboarding to unlock full publishing features.",
      };
    }
    if (reminderIndex === 2) {
      return {
        title: "Complete your profile",
        body: "Finish the remaining setup and start scheduling posts today.",
      };
    }
    if (reminderIndex === 3) {
      return {
        title: "Reminder: onboarding not complete",
        body: "Your account is almost ready. Please complete onboarding.",
      };
    }
    return {
      title: "Final onboarding reminder",
      body: "Complete onboarding now to start growing your business.",
    };
  }

  return { title: "Reminder", body: "Complete onboarding." };
};
