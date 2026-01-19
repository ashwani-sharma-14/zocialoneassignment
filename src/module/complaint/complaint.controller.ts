import { type Response, type Request } from "express";
import {
  createComplaintService,
  getComplaintService,
  updateStatusService,
  complaintMetricsService,
  getComplaintById,
} from "./complaint.service.js";
import { Role } from "@/model/user.model.js";
import { AppError } from "@/util/appErros.js";
export const createComplaintController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: userId missing",
    });
  }
  const userData = req.body;
  const data = {
    complaintType: userData.complaintType,
    description: userData.description,
    user: { id: userId },
  };
  const complaint = await createComplaintService(data);
  if (!complaint) {
    return res.json({ message: "Failed to create complaint", success: false });
  }
  return res
    .json({ message: "Complaint created", success: true, complaint })
    .status(201);
};

export const getComplaintController = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: userId missing",
    });
  }
  const complaints = await getComplaintService(userId);
  return res
    .json({ message: "All your complaints fetched", success: true, complaints })
    .status(201);
};

export const updateStatusController = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.json({ message: "complaint ID is required", success: false });
  }
  const role = req.user?.role;
  if (role != Role.ADMIN) {
    throw new AppError("Unauthorized! you are not admin");
  }
  const data = req.body;
  const updateComplaint = await updateStatusService(id as string, data);
  return res
    .json({
      message: "Status updated successfully and email sent",
      success: true,
      updateComplaint,
    })
    .status(201);
};

export const complaintMetricsController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  if (!id) {
    res.json({ message: "complaint ID is required", success: false });
  }
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: userId missing",
    });
  }

  const complaint = await complaintMetricsService(id as string, userId);
  if (!complaint) {
    return res.json({ message: "No complaint Found", success: false });
  }
  const currentTime = new Date();
  const currentStatusTime =
    currentTime.getTime() - new Date(complaint.statusUpdatedAt).getTime();
  const currStatusMin = Math.floor(currentStatusTime / (1000 * 60));
  const totalTime =
    currentTime.getTime() - new Date(complaint.createdAt).getTime();
  const totalTimeMin = Math.floor(totalTime / (1000 * 60));
  const metricsData = {
    complaintId: complaint?.id,
    currentStatus: complaint?.status,
    timeInCurrentstatus: currStatusMin,
    totalTime: totalTimeMin,
  };
  return res
    .json({
      message: "complaint mextrix found succesfully",
      success: true,
      metricsData,
    })
    .status(200);
};

export const getComplaintByIdController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.json({ message: "You are unauthorised", success: false });
  }
  const { id } = req.params;
  const complaint = getComplaintById(id as string, userId as string);
  if (!complaint) {
    return res.json({ message: "No complaint found", success: false });
  }
  return res
    .json({ message: "Complaint found", success: true, complaint })
    .status(200);
};
