import React, { useState } from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useUpdateTask } from "@/hooks/useTasks";

export default function TaskHeader({ task }) {
  const { data: projects = [] } = useProjects();
  const updateTask = useUpdateTask();
  const [updating, setUpdating] = useState(false);

  const handleProjectChange = async (projectId) => {
    setUpdating(true);
    try {
      await updateTask.mutateAsync({ taskId: task.id, values: { project_id: projectId } });
    } catch (err) {
      console.error("Failed to assign project:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Select value={task.project?.id ?? ""} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={task.project?.name ?? "Unassigned"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{task.project?.name ? "Assigned" : "Unassigned"}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>
    </div>
  );
}
