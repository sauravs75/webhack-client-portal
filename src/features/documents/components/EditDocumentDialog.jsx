import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOCUMENT_CATEGORY_LABELS, documentDetailsSchema } from "@/features/documents/schemas";
import { useProjects } from "@/hooks/useProjects";
import { useUpdateDocument } from "@/hooks/useDocuments";

export default function EditDocumentDialog({ open, onOpenChange, document }) {
  const updateDocument = useUpdateDocument();
  const { data: projects = [] } = useProjects();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(documentDetailsSchema),
    defaultValues: {
      file_name: document?.file_name || "",
      category: document?.category || "other",
      project_id: document?.project_id || "",
    },
  });

  useEffect(() => {
    reset({
      file_name: document?.file_name || "",
      category: document?.category || "other",
      project_id: document?.project_id || "",
    });
  }, [document, reset]);

  if (!open || !document) return null;

  const handleClose = () => {
    setError("");
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    setError("");
    try {
      await updateDocument.mutateAsync({ documentId: document.id, values });
      handleClose();
    } catch (err) {
      setError(err?.message || "Unable to update document.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-2xl">
          <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Edit document</h3>
                <p className="mt-1 text-sm text-muted-foreground">Update document metadata.</p>
              </div>
              <Button variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </div>

            {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="edit_file_name">File Name</Label>
                <Input id="edit_file_name" {...register("file_name")} />
                {errors.file_name ? <p className="text-xs text-destructive">{errors.file_name.message}</p> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit_category">Category</Label>
                  <select id="edit_category" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("category")}>
                    {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_project_id">Related Project</Label>
                  <select id="edit_project_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("project_id")}>
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
                <Button type="submit" isLoading={isSubmitting || updateDocument.isPending}>
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
