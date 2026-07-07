import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUpdateProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import ProjectForm from "@/components/projects/ProjectForm";

export default function EditProjectDialog({ project, onOpenChange }) {
  const updateProject = useUpdateProject();
  const [error, setError] = useState("");

  if (!project) return null;

  const handleSubmit = async (values) => {
    setError("");
    try {
      await updateProject.mutateAsync({ projectId: project.id, values });
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Unable to update project.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit project</h3>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
          <ProjectForm project={project} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Save changes" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
