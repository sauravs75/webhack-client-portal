import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function DeleteProjectDialog({ project, open, onOpenChange, onConfirm, isDeleting }) {
  if (!open || !project) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Delete project?</h3>
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            </div>
          </div>

          <Alert variant="destructive" className="mt-4">
            This will permanently remove <span className="font-semibold">{project.name}</span> and related project data from your workspace.
          </Alert>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" isLoading={isDeleting} onClick={onConfirm}>
              Delete project
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
