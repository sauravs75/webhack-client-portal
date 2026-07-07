import React from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";

export default function TaskHeader({ task }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <p className="text-sm text-muted-foreground">{task.project?.name ?? "Unassigned"}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>
    </div>
  );
}
