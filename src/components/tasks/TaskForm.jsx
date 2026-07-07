import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema } from "@/features/tasks/schemas";

export default function TaskForm({ defaultValues = {}, onSubmit }) {
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(taskFormSchema), defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input {...register("title")} className="mt-1 w-full rounded-md border px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="mt-1 w-full rounded-md border px-2 py-1" />
      </div>
      <div className="flex gap-2">
        <select {...register("status")} className="rounded-md border px-2 py-1">
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="in_review">In Review</option>
          <option value="done">Done</option>
        </select>
        <select {...register("priority")} className="rounded-md border px-2 py-1">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <input type="number" {...register("progress")} min={0} max={100} className="rounded-md border px-2 py-1 w-24" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-primary px-3 py-1 text-white">Save</button>
      </div>
    </form>
  );
}
