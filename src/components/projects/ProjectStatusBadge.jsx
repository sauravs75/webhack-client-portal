import { cn } from "@/lib/utils";

const statusStyles = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  on_hold: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  pending: "Pending",
  on_hold: "On Hold",
  cancelled: "Cancelled",
};

export default function ProjectStatusBadge({ status, className }) {
  const label = statusLabels[status] || "Support";
  const styles = statusStyles[status] || statusStyles.active;

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles, className)}>
      {label}
    </span>
  );
}
