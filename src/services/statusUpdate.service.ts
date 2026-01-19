import { Status } from "@/model/complaint.model.js";
import { sendMockEmail } from "./mockEmail.service.js";
export const statusUpdateEmail = async (
  userEmail: string,
  status: Status,
  complaintId: string,
) => {
  let title = "";
  let body = "";

  switch (status) {
    case Status.RAISED:
      title = "Complaint raised successfully";
      body = `Your complaint (${complaintId}) has been received. Our team will review it soon.`;
      break;

    case Status.IN_PROGRESS:
      title = "Complaint is in progress";
      body = `Your complaint (${complaintId}) is now being worked on by our support team.`;
      break;

    case Status.WAITING_ON_USER:
      title = "Additional details needed";
      body = `We need more information to proceed with your complaint (${complaintId}). Please reply with the required details.`;
      break;

    case Status.RESOLVED:
      title = "Complaint resolved";
      body = `Good news! Your complaint (${complaintId}) has been resolved. Please confirm if everything looks good.`;
      break;

    case Status.CLOSED:
      title = "Complaint closed";
      body = `Your complaint (${complaintId}) has been closed. Thank you for reaching out to us.`;
      break;

    default:
      return;
  }
  await sendMockEmail(userEmail, title, body);
};
