import { z } from "zod";

export const MEETING_STATUSES = ["upcoming", "completed", "cancelled"];

export const MEETING_STATUS_LABELS = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const meetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  project_id: z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional()),
  scheduled_at: z.string().min(1, "Scheduled date and time is required"),
  duration_minutes: z.coerce.number().int().min(5, "Duration must be at least 5 minutes").max(1440, "Duration must be 24 hours or less"),
  meeting_link: z.preprocess(
    (value) => (String(value || "").trim() === "" ? null : String(value).trim()),
    z.string().url("Enter a valid URL").nullable().optional()
  ),
  notes: z.string().optional(),
  status: z.enum(MEETING_STATUSES).default("upcoming"),
});

