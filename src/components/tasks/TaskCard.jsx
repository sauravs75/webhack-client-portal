import React from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskProgressBar from "./TaskProgressBar";
import { Link } from "react-router-dom";

export default function TaskCard({ task }) {
  return (
    <Link to={`/dashboard/tasks/${task.id}`} className="block rounded-lg border border-border/60 bg-background/60 p-4 hover:shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{task.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{task.project?.name ?? "Unassigned"}</p>
        </div>
        <div className="flex items-center gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>
      <div className="mt-3">
        <TaskProgressBar value={task.progress || 0} />
      </div>
    </Link>
  );
}
