import { supabase } from "@/supabase/client";

async function getTableCount(table, filters = []) {
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  filters.forEach((applyFilter) => {
    query = applyFilter(query);
  });

  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

export async function getDashboardStats() {
  const [projectCount, openTaskCount, completedTaskCount, documentCount, upcomingMeetingCount] = await Promise.all([
    getTableCount("projects"),
    getTableCount("tasks", [(query) => query.neq("status", "done")]),
    getTableCount("tasks", [(query) => query.eq("status", "done")]),
    getTableCount("documents"),
    getTableCount("meetings", [(query) => query.eq("status", "upcoming").gte("scheduled_at", new Date().toISOString())]),
  ]);

  return {
    projectCount,
    openTaskCount,
    completedTaskCount,
    documentCount,
    upcomingMeetingCount,
  };
}

export async function getUpcomingMeetings(limit = 3) {
  const { data, error } = await supabase
    .from("meetings")
    .select("id, title, scheduled_at, duration_minutes, status, projects(id, name)")
    .eq("status", "upcoming")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map((meeting) => ({ ...meeting, project: meeting.projects }));
}

export async function getDashboardActivity(limit = 6) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, action, description, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
