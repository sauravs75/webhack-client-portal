import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "@/services/tasks";
import { useToast } from "@/components/ui/toast";

export function useTasks(filters = {}) {
  return useQuery({ queryKey: ["tasks", filters], queryFn: () => getTasks(filters) });
}

export function useTask(taskId) {
  return useQuery({ queryKey: ["task", taskId], queryFn: () => getTask(taskId), enabled: Boolean(taskId) });
}

export function useCreateTask() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Task created", message: "Task created successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Create failed", message: err?.message || "Failed to create task." });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: ({ taskId, values }) => updateTask(taskId, values),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["task", vars.taskId] });
      await qc.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Task updated", message: "Task updated successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Update failed", message: err?.message || "Failed to update task." });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Task deleted", message: "Task deleted successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Delete failed", message: err?.message || "Failed to delete task." });
    },
  });
}
