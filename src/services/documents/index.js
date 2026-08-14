import { supabase } from "@/supabase/client";

const STORAGE_BUCKET = "documents";
const DOCUMENT_SELECT = `
  id,
  owner_id,
  uploaded_by,
  project_id,
  file_name,
  category,
  file_size,
  file_type,
  storage_path,
  created_at,
  updated_at,
  projects(id, name)
`;

function getFileExtension(fileName = "") {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "";
}

function sanitizeFileName(fileName = "document") {
  return fileName.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");
}

function normalizeDocumentPayload(values) {
  return {
    file_name: values.file_name?.trim(),
    category: values.category || "other",
    project_id: values.project_id || null,
  };
}

function getDisplayName(profile) {
  return profile?.full_name || profile?.email || null;
}

async function getProfileMap(userIds = []) {
  const ids = [...new Set(userIds.filter(Boolean))];
  if (ids.length === 0) return new Map();

  const { data, error } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
  if (error) return new Map();

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

function normalizeDocument(document, profileMap = new Map()) {
  if (!document) return document;
  const uploadedById = document.uploaded_by || document.owner_id;
  const uploadedByProfile = profileMap.get(uploadedById);

  return {
    ...document,
    project: document.projects,
    upload_date: document.created_at,
    uploaded_by_name: getDisplayName(uploadedByProfile) || "You",
  };
}

export async function getDocuments(filters = {}) {
  const {
    search = "",
    category = "all",
    projectId = "all",
    sortBy = "uploaded_desc",
    limit = 10,
    page = 1,
  } = filters;

  const ascending = sortBy === "uploaded_asc";
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;

  let query = supabase
    .from("documents")
    .select(DOCUMENT_SELECT, { count: "exact" })
    .order("created_at", { ascending })
    .range(start, end);

  if (search) query = query.ilike("file_name", `%${search}%`);
  if (category !== "all") query = query.eq("category", category);
  if (projectId !== "all") query = query.eq("project_id", projectId);

  const { data, error, count } = await query;
  if (error) throw error;
  const profileMap = await getProfileMap((data ?? []).map((document) => document.uploaded_by || document.owner_id));

  return {
    data: (data ?? []).map((document) => normalizeDocument(document, profileMap)),
    total: count ?? 0,
    page: Number(page),
    limit: Number(limit),
  };
}

export async function getDocument(documentId) {
  const { data, error } = await supabase.from("documents").select(DOCUMENT_SELECT).eq("id", documentId).single();
  if (error) throw error;
  const profileMap = await getProfileMap([data?.uploaded_by || data?.owner_id]);
  return normalizeDocument(data, profileMap);
}

export async function uploadDocument(values) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const file = values.file;
  const extension = getFileExtension(file.name);
  const baseName = values.file_name?.trim() || file.name;
  const fileName = extension && !baseName.toLowerCase().endsWith(`.${extension.toLowerCase()}`) ? `${baseName}.${extension}` : baseName;
  const storagePath = `${ownerId}/${values.project_id}/${Date.now()}-${sanitizeFileName(fileName)}`;

  const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) throw uploadError;

  const payload = {
    owner_id: ownerId,
    uploaded_by: ownerId,
    ...normalizeDocumentPayload({ ...values, file_name: fileName }),
    file_size: file.size,
    file_type: file.type || "application/octet-stream",
    storage_path: storagePath,
    file_path: storagePath,
    mime_type: file.type || "application/octet-stream",
  };

  const { data, error } = await supabase.from("documents").insert(payload).select(DOCUMENT_SELECT).single();
  if (error) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
    throw error;
  }

  await createActivityLog({
    ownerId,
    action: "document_uploaded",
    entityType: "document",
    entityId: data.id,
    description: `Uploaded document "${data.file_name}".`,
  });

  await createNotification({
    ownerId,
    type: "document_uploaded",
    title: "Document uploaded",
    message: `Document "${data.file_name}" was uploaded.`,
    relatedId: data.id,
    relatedType: "document",
  });

  const profileMap = await getProfileMap([data?.uploaded_by || data?.owner_id]);
  return normalizeDocument(data, profileMap);
}

export async function updateDocument(documentId, values) {
  const { data, error } = await supabase
    .from("documents")
    .update(normalizeDocumentPayload(values))
    .eq("id", documentId)
    .select(DOCUMENT_SELECT)
    .single();

  if (error) throw error;
  const profileMap = await getProfileMap([data?.uploaded_by || data?.owner_id]);
  return normalizeDocument(data, profileMap);
}

export async function deleteDocument(documentId) {
  const { data: userData, error: authError } = await supabase.auth.getUser();
  const ownerId = userData?.user?.id;
  if (authError) throw authError;
  if (!ownerId) throw new Error("Authentication required.");

  const document = await getDocument(documentId);
  const { error } = await supabase.from("documents").delete().eq("id", documentId);
  if (error) throw error;

  if (document.storage_path) {
    const { error: storageError } = await supabase.storage.from(STORAGE_BUCKET).remove([document.storage_path]);
    if (storageError) console.error("deleteDocument storage error:", storageError);
  }

  await createActivityLog({
    ownerId,
    action: "document_deleted",
    entityType: "document",
    entityId: documentId,
    description: `Deleted document "${document.file_name}".`,
  });

  await createNotification({
    ownerId,
    type: "document_deleted",
    title: "Document deleted",
    message: `Document "${document.file_name}" was deleted.`,
    relatedId: documentId,
    relatedType: "document",
  });

  return true;
}

export async function getDocumentDownloadUrl(document) {
  if (!document?.storage_path) throw new Error("Document file path is missing.");

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(document.storage_path, 60);
  if (error) throw error;
  return data.signedUrl;
}

async function createActivityLog({ ownerId, action, entityType, entityId, description }) {
  try {
    const { error } = await supabase.from("activity_logs").insert({
      owner_id: ownerId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
    });
    if (error) console.error("createActivityLog error:", error);
  } catch (err) {
    console.error("createActivityLog exception:", err);
  }
}

async function createNotification({ ownerId, type, title, message, relatedId, relatedType }) {
  try {
    const { error } = await supabase.from("notifications").insert({
      owner_id: ownerId,
      type,
      title,
      message,
      related_id: relatedId,
      related_type: relatedType,
    });
    if (error) console.error("createNotification error:", error);
  } catch (err) {
    console.error("createNotification exception:", err);
  }
}
