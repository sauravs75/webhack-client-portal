import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOCUMENT_CATEGORY_LABELS, documentUploadSchema } from "@/features/documents/schemas";
import { useProjects } from "@/hooks/useProjects";
import { useUploadDocument } from "@/hooks/useDocuments";

export default function UploadDocumentDialog({ open, onOpenChange }) {
  const uploadDocument = useUploadDocument();
  const { data: projects = [] } = useProjects();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      file_name: "",
      category: "other",
      project_id: "",
    },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    setError("");
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    setError("");
    try {
      await uploadDocument.mutateAsync(values);
      handleClose();
    } catch (err) {
      setError(err?.message || "Unable to upload document.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-2xl">
          <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Upload document</h3>
                <p className="mt-1 text-sm text-muted-foreground">Store a file and link it to a project.</p>
              </div>
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>

            {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  {...register("file", {
                    onChange: (event) => {
                      const file = event.target.files?.[0];
                      if (file) setValue("file_name", file.name, { shouldValidate: true });
                    },
                  })}
                />
                {errors.file ? <p className="text-xs text-destructive">{errors.file.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_name">File Name</Label>
                <Input id="file_name" {...register("file_name")} />
                {errors.file_name ? <p className="text-xs text-destructive">{errors.file_name.message}</p> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("category")}>
                    {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.category ? <p className="text-xs text-destructive">{errors.category.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_id">Related Project</Label>
                  <select id="project_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("project_id")}>
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {errors.project_id ? <p className="text-xs text-destructive">{errors.project_id.message}</p> : null}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting || uploadDocument.isPending}>
                  Upload document
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
