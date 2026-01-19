import { Router } from "express";
import userRouter from "@/module/user/user.route.js";
import complaintRouter from "@/module/complaint/complaint.route.js";
const systemRouter: Router = Router();
const routes = [
  { path: "/auth", router: userRouter },
  { path: "/complaint", router: complaintRouter },
];

routes.forEach((route) => systemRouter.use(route.path, route.router));

export default systemRouter;
