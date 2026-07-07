import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function ProjectTimeline({ items = [] }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No timeline activity yet.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div key={item.id || index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
          <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock3 className="h-4 w-4" />
          </div>
          <div className="flex-1 rounded-xl border border-border/70 bg-background/60 p-3">
            <p className="text-sm font-medium">{item.title || item.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.description || item.content}</p>
            <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(item.created_at)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
