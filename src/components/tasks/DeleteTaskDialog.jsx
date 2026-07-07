import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useDeleteTask } from "@/hooks/useTasks";

export default function DeleteTaskDialog({ open, onOpenChange, taskId, onDeleted }) {
  const del = useDeleteTask();
  const [error, setError] = useState("");

  if (!open) return null;

  const handleConfirm = async () => {
    setError("");
    try {
      await del.mutateAsync(taskId);
      onOpenChange(false);
      if (onDeleted) onDeleted();
    } catch (err) {
      setError(err?.message || "Unable to delete task.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Delete task</h3>
          </div>
          {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
          <p className="mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm} isLoading={del.isLoading}>Delete</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
