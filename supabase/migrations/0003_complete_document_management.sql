-- =====================================================================
-- Module 7: Document Management compatibility and storage setup
-- =====================================================================

-- Keep the existing documents table, but add the metadata columns used by
-- the Module 7 React/Supabase implementation.
alter table public.documents
  add column if not exists uploaded_by uuid references auth.users(id) on delete set null,
  add column if not exists storage_path text,
  add column if not exists file_type text;

update public.documents
set
  uploaded_by = coalesce(uploaded_by, owner_id),
  storage_path = coalesce(storage_path, file_path),
  file_type = coalesce(file_type, mime_type),
  category = lower(category)
where uploaded_by is null
  or storage_path is null
  or file_type is null
  or category in ('Contract', 'Invoice', 'Report', 'Design', 'Other');

alter table public.documents
  alter column uploaded_by set default auth.uid(),
  alter column storage_path set not null;

alter table public.documents
  drop constraint if exists documents_category_check;

alter table public.documents
  add constraint documents_category_check
  check (category in ('contract', 'invoice', 'report', 'design', 'other'));

create index if not exists idx_documents_created_at on public.documents(owner_id, created_at desc);
create index if not exists idx_documents_category on public.documents(owner_id, category);

-- Document deletion creates a notification, so the enum-style check needs to
-- allow both document lifecycle notification types.
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (type in ('project_update', 'meeting_reminder', 'document_uploaded', 'document_deleted', 'support_reply', 'general'));

-- Supabase Storage bucket and RLS policies for user-scoped document files.
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "documents_storage_select_own" on storage.objects;
create policy "documents_storage_select_own" on storage.objects
  for select using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "documents_storage_insert_own" on storage.objects;
create policy "documents_storage_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "documents_storage_update_own" on storage.objects;
create policy "documents_storage_update_own" on storage.objects
  for update using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  ) with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "documents_storage_delete_own" on storage.objects;
create policy "documents_storage_delete_own" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

