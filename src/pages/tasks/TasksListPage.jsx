import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import TaskTable from "@/components/tasks/TaskTable";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskSearch from "@/components/tasks/TaskSearch";
import CreateTaskDialog from "@/features/tasks/components/CreateTaskDialog";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import { Button } from "@/components/ui/button";
import TaskSkeleton from "@/components/tasks/TaskSkeleton";
import TaskEmptyState from "@/components/tasks/TaskEmptyState";

export default function TasksListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);
  const { data, isLoading, error } = useTasks(filters);

  if (isLoading) return <TaskSkeleton />;

  if (error) {
    // surface and log the error for debugging
    console.error("useTasks error:", error);
    const message = error?.message || (typeof error === "string" ? error : "Unknown error");
    return (
      <div className="text-red-500">
        <div>Failed loading tasks.</div>
        <div className="text-xs mt-2 whitespace-pre-wrap">{String(message)}</div>
      </div>
    );
  }

  const tasks = data?.data ?? [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Tasks</p>
          <h2 className="mt-1 text-2xl font-semibold">Task management</h2>
          <p className="mt-2 text-sm text-muted-foreground">Create, assign, and track tasks across projects.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </motion.div>

      <div className="p-0 sm:p-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-40">
            <TaskSearch value={filters.search || ""} onChange={(q) => setFilters((s) => ({ ...s, search: q }))} onSearch={(q) => setFilters((s) => ({ ...s, search: q }))} />
          </div>
          <div className="flex justify-end">
            <TaskFilters status={filters.status || "all"} onStatusChange={(value) => setFilters((s) => ({ ...s, status: value }))} />
          </div>
        </div>

        {isLoading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <div className="mt-6">
            <TaskEmptyState title="No tasks found" description="Create a task to get started." actionLabel="Create task" onAction={() => setIsCreateOpen(true)} />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <TaskTable tasks={tasks} onEdit={(t) => setEditTask(t)} onDelete={(t) => setDeleteTaskTarget(t)} />
            </div>

            <div className="mt-6 flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={() => setFilters({})}>
                Clear filters
              </Button>
            </div>
          </>
        )}
      </div>

      <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditTaskDialog open={Boolean(editTask)} onOpenChange={() => setEditTask(null)} taskId={editTask?.id} />
      <DeleteTaskDialog open={Boolean(deleteTaskTarget)} onOpenChange={() => setDeleteTaskTarget(null)} taskId={deleteTaskTarget?.id} onDeleted={() => setDeleteTaskTarget(null)} />
    </div>
  );
}
