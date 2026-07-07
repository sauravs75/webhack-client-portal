import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskProgressBar from "./TaskProgressBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { useUpdateTask } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function TaskListItem({ task, onEdit, onDelete }) {
  const { data: projects = [] } = useProjects();
  const updateTask = useUpdateTask();

  const handleProjectChange = async (projectId) => {
    try {
      await updateTask.mutateAsync({ taskId: task.id, values: { project_id: projectId } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/60 p-3">
      <div className="min-w-0">
        <Link to={`/dashboard/tasks/${task.id}`} className="text-sm font-medium block truncate">{task.title}</Link>
        <p className="text-sm text-muted-foreground truncate">{task.description ?? "No description"}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start">
          <TaskStatusBadge status={task.status} />
        </div>

        <div className="w-28">
          <div className="text-xs text-muted-foreground">Progress</div>
          <div className="flex items-center gap-2">
            <TaskProgressBar value={task.progress || 0} />
            <div className="font-medium">{task.progress ?? 0}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <div>{task.deadline ? formatDate(task.deadline) : "—"}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <div>{task.team?.length ?? 0}</div>
          </div>
        </div>

        <Select value={task.project?.id ?? ""} onValueChange={handleProjectChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={task.project?.name ?? "Unassigned"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Unassigned</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline"><Link to={`/dashboard/tasks/${task.id}`}>View</Link></Button>
          <Button size="sm" variant="outline" onClick={() => onEdit?.(task)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(task)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
