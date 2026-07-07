import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectHeader({ title, description, onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">Projects</p>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" />
        New project
      </Button>
    </motion.div>
  );
}
