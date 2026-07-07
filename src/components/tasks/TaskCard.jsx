import React, { useState } from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskProgressBar from "./TaskProgressBar";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useUpdateTask } from "@/hooks/useTasks";

export default function TaskCard({ task }) {
  const { data: projects = [] } = useProjects();
  const updateTask = useUpdateTask();
  const [loading, setLoading] = useState(false);

  const handleProjectChange = async (projectId) => {
    setLoading(true);
    try {
      await updateTask.mutateAsync({ taskId: task.id, values: { project_id: projectId } });
    } catch (err) {
      console.error("Failed to assign project:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="block rounded-lg border border-border/60 bg-background/60 p-4 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate"><Link to={`/dashboard/tasks/${task.id}`} className="block">{task.title}</Link></h3>
          <div className="mt-2 flex items-center gap-2">
            <Select value={task.project?.id ?? ""} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-[140px]" onPointerDown={(e) => e.stopPropagation()}>
                <SelectValue placeholder={task.project?.name ?? "Unassigned"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TaskPriorityBadge priority={task.priority} />
          <TaskStatusBadge status={task.status} />
        </div>
      </div>
      <div className="mt-3">
        <TaskProgressBar value={task.progress || 0} />
      </div>
    </div>
  );
}
