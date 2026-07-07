import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import ProjectForm from "@/components/projects/ProjectForm";

export default function CreateProjectDialog({ open, onOpenChange }) {
  const createProject = useCreateProject();
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (values) => {
    setError("");
    try {
      await createProject.mutateAsync(values);
      onOpenChange(false);
    } catch (err) {
      setError(err.message || "Unable to create project.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Create project</h3>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
          <ProjectForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} submitLabel="Create project" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
