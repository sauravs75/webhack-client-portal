import { useQuery } from "@tanstack/react-query";
import { getDashboardActivity, getDashboardStats, getUpcomingMeetings } from "@/services/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: () => getDashboardActivity(6),
  });
}

export function useUpcomingMeetings() {
  return useQuery({
    queryKey: ["upcomingMeetings"],
    queryFn: () => getUpcomingMeetings(3),
  });
}
