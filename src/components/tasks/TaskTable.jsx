import React from "react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import { Link } from "react-router-dom";

export default function TaskTable({ tasks }) {
  return (
    <div className="overflow-auto rounded-lg border border-border/70 bg-card/80">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Project</th>
            <th className="text-left p-3">Priority</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Progress</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3"><Link to={`/dashboard/tasks/${t.id}`}>{t.title}</Link></td>
              <td className="p-3">{t.project?.name ?? "-"}</td>
              <td className="p-3"><TaskPriorityBadge priority={t.priority} /></td>
              <td className="p-3"><TaskStatusBadge status={t.status} /></td>
              <td className="p-3">{t.progress}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
