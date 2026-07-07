import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  progress: z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().min(0).max(100).optional().default(0)),
  deadline: z.string().optional().nullable(),
  project_id: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()).refine((v) => v !== null && v !== undefined && v !== "", {
    message: "Project is required",
  }),
  assignee_id: z.string().optional().nullable(),
});

export const TASK_STATUSES = ["todo", "in_progress", "in_review", "done"];
export const TASK_PRIORITIES = ["low", "medium", "high", "urgent"];
