import { supabase } from "@/supabase/client";

const TASK_SELECT = `id, owner_id, project_id, title, description, priority, status, deadline, completed_percent, created_at, updated_at, projects(id, name)`;

function normalizeTaskPayload(values) {
  return {
    project_id: values.project_id || null,
    title: values.title?.trim(),
    description: values.description?.trim() || null,
    priority: values.priority,
    status: values.status,
    deadline: values.deadline || null,
    completed_percent: Number(values.completed_percent ?? values.progress ?? 0) || 0,
  };
}

export async function getTasks(filters = {}) {
  const { search = "", status = "all", priority = "all", sortBy = "updated_desc", limit = 50, page = 1 } = filters;

  let query = supabase.from("tasks").select(TASK_SELECT).order("updated_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);
  if (priority !== "all") query = query.eq("priority", priority);

  const { data, error } = await query;
  if (error) throw error;

  // normalize progress field for UI compatibility (some DBs use completed_percent)
  const normalizedData = (data ?? []).map((t) => ({ ...t, progress: Number(t.completed_percent ?? 0) }));

  const tasks = (normalizedData ?? []).filter((task) => {
    const term = (search || "").toLowerCase();
    if (!term) return true;
    return [task.title, task.description, task.status, task.priority, task.projects?.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  const sorted = [...tasks];
  sorted.sort((a, b) => {
    if (sortBy === "deadline_asc") return new Date(a.deadline || "9999-12-31") - new Date(b.deadline || "9999-12-31");
    if (sortBy === "deadline_desc") return new Date(b.deadline || "9999-12-31") - new Date(a.deadline || "9999-12-31");
    if (sortBy === "progress_asc") return (a.completed_percent ?? a.progress ?? 0) - (b.completed_percent ?? b.progress ?? 0);
    if (sortBy === "progress_desc") return (b.completed_percent ?? b.progress ?? 0) - (a.completed_percent ?? a.progress ?? 0);
    if (sortBy === "created_asc") return new Date(a.created_at) - new Date(b.created_at);
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  // simple pagination
  const start = (page - 1) * limit;
  const paged = sorted.slice(start, start + limit);

  return { data: paged, total: sorted.length };
}

export async function getTask(taskId) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      owner_id,
      project_id,
      title,
      description,
      priority,
      status,
      deadline,
      completed_percent,
      progress,
      created_at,
      updated_at,
      projects(id, name),
      task_comments(*),
      activity_logs(*)
    `)
    .eq("id", taskId)
    .single();

  if (error) throw error;
  // expose `progress` for UI components
  if (data) data.progress = Number(data.completed_percent ?? 0);
  return data;
}

export async function createTask(values) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const payload = {
    owner_id: ownerId,
    ...normalizeTaskPayload(values),
  };

  const { data, error } = await supabase.from("tasks").insert(payload).select(TASK_SELECT).single();
  if (error) throw error;

  await createActivityLog({ ownerId, action: "task_created", entityType: "task", entityId: data.id, description: `Created task “${data.title}”.` });
  await createNotification({ ownerId, type: "task_created", title: "New task", message: `Task “${data.title}” created.`, relatedId: data.id, relatedType: "task" });

  return data;
}

export async function updateTask(taskId, values) {
  const payload = normalizeTaskPayload(values);
  const previous = await getTask(taskId);

  const { data, error } = await supabase.from("tasks").update(payload).eq("id", taskId).select(TASK_SELECT).single();
  if (error) throw error;

  if (previous?.status !== data.status) {
    await createActivityLog({ ownerId: data.owner_id, action: "task_status_changed", entityType: "task", entityId: taskId, description: `Task status changed to ${data.status}.` });
    await createNotification({ ownerId: data.owner_id, type: "task_status_changed", title: "Task status updated", message: `Task “${data.title}” is now ${data.status}.`, relatedId: taskId, relatedType: "task" });
  }

  if ((previous?.completed_percent ?? previous?.progress ?? 0) !== (data.completed_percent ?? data.progress ?? 0) && (data.completed_percent ?? data.progress ?? 0) === 100) {
    await createActivityLog({ ownerId: data.owner_id, action: "task_completed", entityType: "task", entityId: taskId, description: `Completed task “${data.title}”.` });
    await createNotification({ ownerId: data.owner_id, type: "task_completed", title: "Task completed", message: `Task “${data.title}” has been completed.`, relatedId: taskId, relatedType: "task" });
  }

  return data;
}

export async function deleteTask(taskId) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;

  await createActivityLog({ ownerId, action: "task_deleted", entityType: "task", entityId: taskId, description: "Deleted a task." });

  return true;
}

export async function createTaskComment(taskId, content) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const { data, error } = await supabase
    .from("task_comments")
    .insert({ owner_id: ownerId, task_id: taskId, content })
    .select("id, owner_id, content, created_at")
    .single();
  if (error) throw error;

  await createActivityLog({ ownerId, action: "task_commented", entityType: "task", entityId: taskId, description: `Commented on task.` });

  return data;
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
