import { DataSource } from "typeorm";
import { envConfig } from "./env.config.js";
import { error, warn } from "console";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: envConfig.dbHost as string,
  port: Number(envConfig.dbPort),
  username: envConfig.dbUser as string,
  password: envConfig.dbPassword as string,
  database: envConfig.dbName as string,
  synchronize: envConfig.nodeEnvironment == "production" ? false : true,
  logging: ["error", "warn"],
  entities: ["dist/model/*.js"],
  subscribers: ["src/subscriber/*.ts"],
  migrations: ["src/migrations/*.ts"],
});
