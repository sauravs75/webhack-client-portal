import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "@/services/tasks";

export function useTasks(filters = {}) {
  return useQuery({ queryKey: ["tasks", filters], queryFn: () => getTasks(filters) });
}

export function useTask(taskId) {
  return useQuery({ queryKey: ["task", taskId], queryFn: () => getTask(taskId), enabled: Boolean(taskId) });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createTask, onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["tasks"] }); await qc.invalidateQueries({ queryKey: ["activityLogs"] }); } });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ taskId, values }) => updateTask(taskId, values), onSuccess: async (_data, vars) => { await qc.invalidateQueries({ queryKey: ["tasks"] }); await qc.invalidateQueries({ queryKey: ["task", vars.taskId] }); await qc.invalidateQueries({ queryKey: ["activityLogs"] }); } });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteTask, onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["tasks"] }); await qc.invalidateQueries({ queryKey: ["activityLogs"] }); } });
}
