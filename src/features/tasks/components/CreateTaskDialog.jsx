import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateTask } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import TaskForm from "@/components/tasks/TaskForm";

export default function CreateTaskDialog({ open, onOpenChange, defaultValues = {} }) {
  const createTask = useCreateTask();
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (values) => {
    setError("");
    try {
      await createTask.mutateAsync(values);
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || "Unable to create task.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Create task</h3>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
          <TaskForm onSubmit={handleSubmit} defaultValues={defaultValues} submitLabel="Create task" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
