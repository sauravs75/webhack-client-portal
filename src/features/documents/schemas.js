import { z } from "zod";

export const DOCUMENT_CATEGORIES = ["contract", "invoice", "report", "design", "other"];

export const DOCUMENT_CATEGORY_LABELS = {
  contract: "Contract",
  invoice: "Invoice",
  report: "Report",
  design: "Design",
  other: "Other",
};

export const documentUploadSchema = z.object({
  file: z
    .custom((value) => value instanceof FileList && value.length > 0, "File is required")
    .transform((value) => value.item(0)),
  file_name: z.string().min(1, "File name is required"),
  category: z.enum(DOCUMENT_CATEGORIES).default("other"),
  project_id: z.preprocess((value) => (value === "" ? null : value), z.string().nullable()).refine(Boolean, {
    message: "Project is required",
  }),
});

export const documentDetailsSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  category: z.enum(DOCUMENT_CATEGORIES).default("other"),
  project_id: z.preprocess((value) => (value === "" ? null : value), z.string().nullable()).refine(Boolean, {
    message: "Project is required",
  }),
});
