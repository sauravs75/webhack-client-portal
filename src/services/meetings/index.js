import { supabase } from "@/supabase/client";

const MEETING_SELECT = `
  id,
  owner_id,
  project_id,
  title,
  meeting_link,
  scheduled_at,
  duration_minutes,
  notes,
  status,
  created_at,
  updated_at,
  projects(id, name)
`;

function normalizeMeetingPayload(values) {
  return {
    project_id: values.project_id || null,
    title: values.title?.trim(),
    meeting_link: values.meeting_link?.trim() || null,
    scheduled_at: values.scheduled_at ? new Date(values.scheduled_at).toISOString() : null,
    duration_minutes: Number(values.duration_minutes || 30),
    notes: values.notes?.trim() || null,
    status: values.status || "upcoming",
  };
}

function normalizeMeeting(meeting) {
  if (!meeting) return meeting;
  return {
    ...meeting,
    project: meeting.projects,
  };
}

export async function getMeetings(filters = {}) {
  const { search = "", status = "all", projectId = "all", sortBy = "date_asc", limit = 10, page = 1 } = filters;
  const ascending = sortBy !== "date_desc";
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  let query = supabase
    .from("meetings")
    .select(MEETING_SELECT, { count: "exact" })
    .order("scheduled_at", { ascending })
    .range(start, end);

  if (search) query = query.ilike("title", `%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  if (projectId !== "all") query = query.eq("project_id", projectId);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data ?? []).map(normalizeMeeting),
    total: count ?? 0,
    page: Number(page),
    limit: Number(limit),
  };
}

export async function getMeeting(meetingId) {
  const { data, error } = await supabase.from("meetings").select(MEETING_SELECT).eq("id", meetingId).single();
  if (error) throw error;
  return normalizeMeeting(data);
}

export async function createMeeting(values) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const payload = {
    owner_id: ownerId,
    ...normalizeMeetingPayload(values),
  };

  const { data, error } = await supabase.from("meetings").insert(payload).select(MEETING_SELECT).single();
  if (error) throw error;

  await createActivityLog({
    ownerId,
    action: "meeting_created",
    entityType: "meeting",
    entityId: data.id,
    description: `Scheduled meeting "${data.title}".`,
  });
  await createNotification({
    ownerId,
    type: "meeting_scheduled",
    title: "Meeting scheduled",
    message: `Meeting "${data.title}" was scheduled.`,
    relatedId: data.id,
    relatedType: "meeting",
  });

  return normalizeMeeting(data);
}

export async function updateMeeting(meetingId, values) {
  const previous = await getMeeting(meetingId);
  const payload = normalizeMeetingPayload(values);

  const { data, error } = await supabase.from("meetings").update(payload).eq("id", meetingId).select(MEETING_SELECT).single();
  if (error) throw error;

  const action =
    previous?.status !== data.status && data.status === "cancelled"
      ? "meeting_cancelled"
      : previous?.status !== data.status && data.status === "completed"
        ? "meeting_completed"
        : "meeting_updated";

  await createActivityLog({
    ownerId: data.owner_id,
    action,
    entityType: "meeting",
    entityId: data.id,
    description:
      action === "meeting_cancelled"
        ? `Cancelled meeting "${data.title}".`
        : action === "meeting_completed"
          ? `Completed meeting "${data.title}".`
          : `Updated meeting "${data.title}".`,
  });

  if (action === "meeting_cancelled" || action === "meeting_updated") {
    await createNotification({
      ownerId: data.owner_id,
      type: action === "meeting_cancelled" ? "meeting_cancelled" : "meeting_updated",
      title: action === "meeting_cancelled" ? "Meeting cancelled" : "Meeting updated",
      message: `Meeting "${data.title}" was ${action === "meeting_cancelled" ? "cancelled" : "updated"}.`,
      relatedId: data.id,
      relatedType: "meeting",
    });
  }

  return normalizeMeeting(data);
}

export async function deleteMeeting(meetingId) {
  const meeting = await getMeeting(meetingId);
  const { error } = await supabase.from("meetings").delete().eq("id", meetingId);
  if (error) throw error;

  await createActivityLog({
    ownerId: meeting.owner_id,
    action: "meeting_deleted",
    entityType: "meeting",
    entityId: meetingId,
    description: `Deleted meeting "${meeting.title}".`,
  });

  return true;
}

async function createActivityLog({ ownerId, action, entityType, entityId, description }) {
  try {
    const { error } = await supabase.from("activity_logs").insert({ owner_id: ownerId, action, entity_type: entityType, entity_id: entityId, description });
    if (error) console.error("createActivityLog error:", error);
  } catch (err) {
    console.error("createActivityLog exception:", err);
  }
}

async function createNotification({ ownerId, type, title, message, relatedId, relatedType }) {
  try {
    const { error } = await supabase.from("notifications").insert({ owner_id: ownerId, type, title, message, related_id: relatedId, related_type: relatedType });
    if (error) console.error("createNotification error:", error);
  } catch (err) {
    console.error("createNotification exception:", err);
  }
}

