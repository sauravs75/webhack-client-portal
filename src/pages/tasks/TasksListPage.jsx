import React, { useState } from "react";
import { useTasks, useCreateTask } from "@/hooks/useTasks";
import TaskCard from "@/components/tasks/TaskCard";
import TaskTable from "@/components/tasks/TaskTable";
import TaskKanbanBoard from "@/components/tasks/TaskKanbanBoard";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskSearch from "@/components/tasks/TaskSearch";
import TaskSkeleton from "@/components/tasks/TaskSkeleton";
import TaskEmptyState from "@/components/tasks/TaskEmptyState";

export default function TasksListPage() {
  const [view, setView] = useState("kanban");
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useTasks(filters);

  if (isLoading) return <TaskSkeleton />;
  if (error) return <div className="text-red-500">Failed loading tasks.</div>;

  const tasks = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-primary">Tasks</p>
          <h2 className="text-2xl font-semibold">Task management</h2>
        </div>
        <div className="flex items-center gap-2">
          <TaskSearch onSearch={(q) => setFilters((s) => ({ ...s, search: q }))} />
          <TaskFilters onChange={(f) => setFilters((s) => ({ ...s, ...f }))} />
          <div className="btn-group">
            <button onClick={() => setView("kanban")} className="btn">Kanban</button>
            <button onClick={() => setView("table")} className="btn">Table</button>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <TaskEmptyState />
      ) : view === "kanban" ? (
        <TaskKanbanBoard tasks={tasks} />
      ) : (
        <TaskTable tasks={tasks} />
      )}
    </div>
  );
}
