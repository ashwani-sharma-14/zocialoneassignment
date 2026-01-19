import { authenticateToken } from "@/middleware/authMiddleware.js";
import { asyncWrap } from "@/util/asyncWrap.js";
import { Router } from "express";

import {
  getComplaintController,
  createComplaintController,
  updateStatusController,
  complaintMetricsController,
} from "./complaint.controller.js";
import { complaintSchema, statusUpdateSchema } from "./complaint.validate.js";
import { validate } from "@/middleware/validate.js";
const complaintRouter: Router = Router();
complaintRouter.post(
  "/",
  authenticateToken,
  validate(complaintSchema),
  asyncWrap(createComplaintController),
);

complaintRouter.get("/", authenticateToken, asyncWrap(getComplaintController));
complaintRouter.patch(
  "/:id/status",
  authenticateToken,
  validate(statusUpdateSchema),
  asyncWrap(updateStatusController),
);
complaintRouter.get(
  "/:id/metrics",
  authenticateToken,
  asyncWrap(complaintMetricsController),
);
export default complaintRouter;
