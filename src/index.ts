import "reflect-metadata";
import http from "http";
import app from "./app.js";
import { envConfig } from "./config/env.config.js";
const server = http.createServer(app);
const port = envConfig.port;
import { AppDataSource } from "./config/data-source.js";
import { registerAdmin } from "./seed/adminSeed.js";
import { startOnboardingReminderCron } from "./cron/onboarding.cron.js";
server.listen(port, async () => {
  await AppDataSource.initialize()
    .then(async () => {
      console.log("Connected to Data Base");
      await registerAdmin();
      startOnboardingReminderCron();
    })
    .catch((err) =>
      console.log(
        {
          message: "Error in Database Connection",
          Error: { ...err },
        },
        err,
      ),
    );
  console.log("server is listning at port: ", port);
});
