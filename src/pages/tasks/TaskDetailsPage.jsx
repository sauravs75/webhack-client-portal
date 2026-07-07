import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "@/hooks/useTasks";
import TaskHeader from "@/components/tasks/TaskHeader";
import TaskComments from "@/components/tasks/TaskComments";
import TaskActivity from "@/components/tasks/TaskActivity";
import { Button } from "@/components/ui/button";
import EditTaskDialog from "@/features/tasks/components/EditTaskDialog";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTask(id);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Failed loading task.</div>;

  const task = data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <TaskHeader task={task} />
        <div className="flex gap-2">
          <Button onClick={() => setEditOpen(true)}>Edit</Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Delete</Button>
        </div>
      </div>

      <EditTaskDialog open={editOpen} onOpenChange={setEditOpen} taskId={id} />
      <DeleteTaskDialog open={deleteOpen} onOpenChange={setDeleteOpen} taskId={id} onDeleted={() => navigate('/dashboard/tasks')} />

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
