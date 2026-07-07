import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().trim().min(3, "Project name is required"),
  description: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["active", "completed", "pending", "on_hold", "cancelled"], {
    required_error: "Please select a status",
  }),
  progress: z.coerce.number().min(0, "Progress must be at least 0").max(100, "Progress must be 100 or less"),
  deadline: z.string().optional().or(z.literal("")),
  service_id: z.string().optional().or(z.literal("")),
  assigned_team: z.string().optional().or(z.literal("")),
});
