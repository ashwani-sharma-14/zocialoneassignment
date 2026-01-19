import express, { type Express } from "express";
const app: Express = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { globalErrorHandler } from "./middleware/globalErrorHandling.js";
import systemRouter from "./routes/routes.js";
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", systemRouter);

app.get("/", (_req, res) => {
  return res
    .json({
      message: "Hello from server",
      success: true,
    })
    .status(200);
});
app.use(globalErrorHandler);
export default app;
