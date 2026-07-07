import { Link } from "react-router-dom";
import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskProgressBar from "./TaskProgressBar";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { formatDate } from "@/lib/utils";

export default function TaskTable({ tasks, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div>
                  <p className="font-medium truncate">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.description ? String(t.description).slice(0, 80) : "No description"}</p>
                </div>
              </TableCell>
              <TableCell>{t.project?.name ?? "-"}</TableCell>
              <TableCell><TaskPriorityBadge priority={t.priority} /></TableCell>
              <TableCell><TaskStatusBadge status={t.status} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="flex items-center gap-2">
                    <TaskProgressBar value={t.progress || 0} />
                    <div className="font-medium">{t.progress ?? 0}%</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {t.deadline ? formatDate(t.deadline) : "—"}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/dashboard/tasks/${t.id}`}>View</Link>
                  </Button>
                  {onEdit ? (
                    <Button size="sm" variant="outline" onClick={() => onEdit(t)}>
                      Edit
                    </Button>
                  ) : null}
                  {onDelete ? (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(t)}>
                      Delete
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
