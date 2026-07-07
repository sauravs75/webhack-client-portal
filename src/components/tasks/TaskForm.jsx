import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taskFormSchema } from "@/features/tasks/schemas";
import { useProjects } from "@/hooks/useProjects";

export default function TaskForm({ defaultValues = {}, onSubmit, submitLabel = "Save" }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(taskFormSchema), defaultValues: {
    title: defaultValues.title || "",
    description: defaultValues.description || "",
    status: defaultValues.status || "todo",
    priority: defaultValues.priority || "medium",
    progress: Number(defaultValues.progress ?? defaultValues.completed_percent ?? 0),
    deadline: defaultValues.deadline || "",
    project_id: defaultValues.project_id || defaultValues.project?.id || null,
  } });

  useEffect(() => {
    reset({
      title: defaultValues.title || "",
      description: defaultValues.description || "",
      status: defaultValues.status || "todo",
      priority: defaultValues.priority || "medium",
      progress: Number(defaultValues.progress ?? defaultValues.completed_percent ?? 0),
      deadline: defaultValues.deadline || "",
      project_id: defaultValues.project_id || defaultValues.project?.id || "",
    });
  }, [defaultValues, reset]);

  const { data: projectsData = [], isLoading: projectsLoading } = useProjects();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          className="flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress">Progress (%)</Label>
          <Input id="progress" type="number" min={0} max={100} {...register("progress")} />
          {errors.progress && <p className="text-xs text-destructive">{errors.progress.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_id">Project</Label>
        <select id="project_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("project_id")}>
          <option value="">Select project</option>
          {projectsData?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors.project_id && <p className="text-xs text-destructive">{errors.project_id.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
}
