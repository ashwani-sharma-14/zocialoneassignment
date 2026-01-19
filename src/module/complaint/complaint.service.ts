import { AppDataSource } from "@/config/data-source.js";
import { Complaint, ComplaintType, Status } from "@/model/complaint.model.js";
import { AppError } from "@/util/appErros.js";
import { statusUpdateEmail } from "@/services/statusUpdate.service.js";
const complaintRepo = AppDataSource.getRepository(Complaint);
interface createComplaintDTO {
  complaintType: ComplaintType;
  description: string;
  user: { id: string };
}
interface UpdateStatusDTO {
  status: Status;
  statusUpdatedAt: Date;
}
export const createComplaintService = async (data: createComplaintDTO) => {
  const complaint = complaintRepo.create(data);
  const savedComplaint = await complaintRepo.save(complaint);
  if (!savedComplaint) throw new AppError("Failed to create Complaint");
  return savedComplaint;
};

export const getComplaintService = async (userId: string) => {
  const complaints = await complaintRepo.find({
    where: {
      user: { id: userId },
    },
  });
  if (!Complaint) throw new AppError("No complaint found");
  return complaints;
};

export const getComplaintById = async (id: string, userId: string) => {
  const complaint = await complaintRepo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!complaint) throw new AppError("Inavalid Complaint Id");
  return complaint;
};

const allowedTransitions: Record<Status, Status[]> = {
  [Status.RAISED]: [Status.IN_PROGRESS],
  [Status.IN_PROGRESS]: [Status.WAITING_ON_USER, Status.RESOLVED],
  [Status.WAITING_ON_USER]: [Status.IN_PROGRESS, Status.RESOLVED],
  [Status.RESOLVED]: [Status.CLOSED],
  [Status.CLOSED]: [],
};

export const updateStatusService = async (
  id: string,
  data: UpdateStatusDTO,
) => {
  const complaint = await complaintRepo.findOneBy({ id });
  if (!complaint) {
    throw new AppError("Complaint not found");
  }
  const currentStatus = complaint.status;
  const nextStatus = data.status;
  if (currentStatus === nextStatus) {
    return complaint;
  }
  const canMove = allowedTransitions[currentStatus]?.includes(nextStatus);
  if (!canMove) {
    throw new AppError("Invalid Status transtion");
  }
  const currentTime = new Date();
  const updatedData: Partial<Complaint> = {
    status: nextStatus,
    statusUpdatedAt: currentTime,
  };
  const result = await complaintRepo.update(complaint.id, updatedData);

  if (result.affected === 0) {
    throw new AppError("Update failed");
  }
  const updatedComplaint = await complaintRepo.findOne({
    where: { id },
    relations: { user: true },
  });
  await statusUpdateEmail(
    updatedComplaint?.user.email as string,
    updatedComplaint?.status as Status,
    updatedComplaint?.id as string,
  );
  return updatedComplaint;
};

export const complaintMetricsService = async (id: string, userId: string) => {
  const complaint = complaintRepo.findOne({
    where: { id, user: { id: userId } },
  });
  if (!complaint) {
    throw new AppError("No complaint exists");
  }
  return complaint;
};
