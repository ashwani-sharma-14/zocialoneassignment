import * as z from "zod";
export const complaintSchema = z.object({
  body: z.object({
    complaintType: z.enum([
      "liveDemo",
      "billingIssue",
      "technicalIssue",
      "feedback",
    ]),
    description: z.string("description is needed"),
  }),
});

export const updateComplaintSchema = z.object({
  body: z.object({
    complaintType: z
      .enum(["liveDemo", "billingIssue", "technicalIssue", "feedback"])
      .optional(),
    description: z.string().optional(),
  }),
});

export const statusUpdateSchema = z.object({
  body: z.object({
    status: z.enum([
      "raised",
      "inProgress",
      "waitingOnUser",
      "resolved",
      "closed",
    ]),
  }),
});

export type ComplaintSchema = z.infer<typeof complaintSchema>;
export type UpdateComplaintSchema = z.infer<typeof updateComplaintSchema>;
export type StatusUpdateSchema = z.infer<typeof statusUpdateSchema>;
