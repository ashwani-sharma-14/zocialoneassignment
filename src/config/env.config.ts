import { configDotenv } from "dotenv";
configDotenv();

export const envConfig = {
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  nodeEnvironment: process.env.NODE_ENVIRONMENT,
  accessSecret: process.env.ACCESS_SECRET,
  accessTimeout: process.env.ACCESS_TIMEOUT || "15m",
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};
