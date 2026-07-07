import React from "react";
import { useParams } from "react-router-dom";
import { useTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import TaskHeader from "@/components/tasks/TaskHeader";
import TaskComments from "@/components/tasks/TaskComments";
import TaskActivity from "@/components/tasks/TaskActivity";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useTask(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed loading task.</div>;

  const task = data;

  return (
    <div className="space-y-6">
      <TaskHeader task={task} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <div className="prose max-w-none">{task.description}</div>
          <TaskComments taskId={task.id} />
        </div>
        <div className="space-y-4">
          <TaskActivity taskId={task.id} />
        </div>
      </div>
    </div>
  );
}
