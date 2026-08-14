import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createMeeting, deleteMeeting, getMeeting, getMeetings, updateMeeting } from "@/services/meetings";
import { useToast } from "@/components/ui/toast";

export function useMeetings(filters = {}) {
  return useQuery({
    queryKey: ["meetings", filters],
    queryFn: () => getMeetings(filters),
  });
}

export function useMeeting(meetingId) {
  return useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(meetingId),
    enabled: Boolean(meetingId),
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      await queryClient.invalidateQueries({ queryKey: ["upcomingMeetings"] });
      await queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Meeting created", message: "Meeting scheduled successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Create failed", message: err?.message || "Failed to create meeting." });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ meetingId, values }) => updateMeeting(meetingId, values),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
      await queryClient.invalidateQueries({ queryKey: ["meeting", variables.meetingId] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      await queryClient.invalidateQueries({ queryKey: ["upcomingMeetings"] });
      await queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Meeting updated", message: "Meeting updated successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Update failed", message: err?.message || "Failed to update meeting." });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["meetings"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      await queryClient.invalidateQueries({ queryKey: ["upcomingMeetings"] });
      await queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
      addToast({ variant: "success", title: "Meeting deleted", message: "Meeting deleted successfully." });
    },
    onError: (err) => {
      addToast({ variant: "destructive", title: "Delete failed", message: err?.message || "Failed to delete meeting." });
    },
  });
}

