import { supabase } from "@/supabase/client";

const PROJECT_SELECT = "id, owner_id, service_id, name, description, status, progress, deadline, assigned_team, created_at, updated_at, services(name)";

function normalizeTeam(teamValue) {
  if (!teamValue) return [];

  if (Array.isArray(teamValue)) {
    return teamValue.map((member) => ({
      name: member.name || "Team member",
      role: member.role || "Contributor",
      avatar_url: member.avatar_url || null,
    }));
  }

  return teamValue
    .split(",")
    .map((member) => member.trim())
    .filter(Boolean)
    .map((name) => ({ name, role: "Contributor", avatar_url: null }));
}

function normalizeProjectPayload(values) {
  return {
    name: values.name?.trim(),
    description: values.description?.trim() || null,
    status: values.status,
    progress: Number(values.progress) || 0,
    deadline: values.deadline || null,
    service_id: values.service_id || null,
    assigned_team: normalizeTeam(values.assigned_team),
  };
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getProjects(filters = {}) {
  const { search = "", status = "all", sortBy = "updated_desc" } = filters;

  let query = supabase.from("projects").select(PROJECT_SELECT).order("updated_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  const projects = (data ?? []).filter((project) => {
    const term = search.toLowerCase();
    if (!term) return true;

    return [project.name, project.description, project.status]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term));
  });

  const sorted = [...projects];
  sorted.sort((a, b) => {
    if (sortBy === "deadline_asc") {
      return new Date(a.deadline || "9999-12-31") - new Date(b.deadline || "9999-12-31");
    }

    if (sortBy === "deadline_desc") {
      return new Date(b.deadline || "9999-12-31") - new Date(a.deadline || "9999-12-31");
    }

    if (sortBy === "progress_asc") {
      return a.progress - b.progress;
    }

    if (sortBy === "progress_desc") {
      return b.progress - a.progress;
    }

    if (sortBy === "created_asc") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  return sorted;
}

export async function getProject(projectId) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, owner_id, service_id, name, description, status, progress, deadline, assigned_team, created_at, updated_at, services(name), tasks(*), project_updates(*), documents(*), meetings(*), payments(*)"
    )
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(values) {
  const { data: userData } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;

  if (!ownerId) {
    throw new Error("You must be signed in to create a project.");
  }

  const payload = {
    owner_id: ownerId,
    ...normalizeProjectPayload(values),
  };

  const { data, error } = await supabase.from("projects").insert(payload).select(PROJECT_SELECT).single();

  if (error) throw error;

  await createActivityLog({
    ownerId,
    action: "project_created",
    entityType: "project",
    entityId: data.id,
    description: `Created project “${data.name}”.`,
  });

  await createNotification({
    ownerId,
    type: "project_update",
    title: "New project created",
    message: `Project “${data.name}” is now in your workspace.`,
    relatedId: data.id,
    relatedType: "project",
  });

  return data;
}

export async function updateProject(projectId, values) {
  const payload = normalizeProjectPayload(values);
  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", projectId)
    .select(PROJECT_SELECT)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId) {
  const { data: userData } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;

  if (!ownerId) {
    throw new Error("You must be signed in to delete a project.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) throw error;

  await createActivityLog({
    ownerId,
    action: "project_deleted",
    entityType: "project",
    entityId: projectId,
    description: "Deleted a project.",
  });

  return true;
}

export async function createActivityLog({ ownerId, action, entityType, entityId, description }) {
  const { error } = await supabase.from("activity_logs").insert({
    owner_id: ownerId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    description,
  });

  if (error) throw error;
}

export async function createNotification({ ownerId, type, title, message, relatedId, relatedType }) {
  const { error } = await supabase.from("notifications").insert({
    owner_id: ownerId,
    type,
    title,
    message,
    related_id: relatedId,
    related_type: relatedType,
  });

  if (error) throw error;
}

export async function getActivityLogs(limit = 6) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, action, description, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
