-- =====================================================================
-- WebHack Solutions — Client Portal
-- Module 2: Database Schema + Row Level Security
-- =====================================================================
-- HOW TO RUN THIS:
-- 1. Open your Supabase project → SQL Editor → New Query
-- 2. Paste this entire file
-- 3. Click "Run"
-- It is safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. SHARED HELPER: auto-update `updated_at` on every table
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------
-- 2. SERVICES
-- Catalog of services WebHack Solutions offers (e.g. "SEO", "Web Dev").
-- Managed by admins via the service_role key — clients only read.
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete set null, -- admin who created it (nullable)
  name text not null,
  description text,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. PROFILES
-- One row per authenticated user (1:1 with auth.users). This is the
-- "users" table from the spec — Supabase already manages auth.users,
-- so we extend it here with public-facing profile data.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  company_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  two_factor_enabled boolean not null default false,
  notification_preferences jsonb not null default '{
    "project_updates": true,
    "meeting_reminders": true,
    "document_uploads": true,
    "support_replies": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, owner_id, email, full_name)
  values (
    new.id,
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 4. PROJECTS
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'completed', 'pending', 'on_hold', 'cancelled')),
  progress smallint not null default 0 check (progress between 0 and 100),
  deadline date,
  assigned_team jsonb not null default '[]'::jsonb, -- [{ "name": "...", "role": "...", "avatar_url": "..." }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_owner_id on public.projects(owner_id);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 5. PROJECT UPDATES (timeline / milestones / comments feed)
-- ---------------------------------------------------------------------
create table if not exists public.project_updates (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null default 'update' check (type in ('update', 'milestone', 'comment')),
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_updates_project_id on public.project_updates(project_id);
create index if not exists idx_project_updates_owner_id on public.project_updates(owner_id);

drop trigger if exists trg_project_updates_updated_at on public.project_updates;
create trigger trg_project_updates_updated_at
  before update on public.project_updates
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 6. TASKS
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'in_review', 'done')),
  deadline date,
  completed_percent smallint not null default 0 check (completed_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_owner_id on public.tasks(owner_id);

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 7. DOCUMENTS (metadata table — actual files live in Supabase Storage)
-- ---------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  folder text not null default 'General',
  category text not null default 'Other' check (category in ('Contract', 'Invoice', 'Report', 'Design', 'Other')),
  file_name text not null,
  file_path text not null, -- path inside the 'documents' storage bucket
  file_size bigint,
  mime_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_owner_id on public.documents(owner_id);
create index if not exists idx_documents_project_id on public.documents(project_id);

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 8. MEETINGS
-- ---------------------------------------------------------------------
create table if not exists public.meetings (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  meeting_link text,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  notes text,
  status text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_meetings_owner_id on public.meetings(owner_id);
create index if not exists idx_meetings_scheduled_at on public.meetings(scheduled_at);

drop trigger if exists trg_meetings_updated_at on public.meetings;
create trigger trg_meetings_updated_at
  before update on public.meetings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ---------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('project_update', 'meeting_reminder', 'document_uploaded', 'support_reply', 'general')),
  title text not null,
  message text,
  is_read boolean not null default false,
  related_id uuid, -- points to a project, meeting, document, or ticket id
  related_type text, -- 'project' | 'meeting' | 'document' | 'support_ticket'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_notifications_owner_id on public.notifications(owner_id);
create index if not exists idx_notifications_is_read on public.notifications(owner_id, is_read);

drop trigger if exists trg_notifications_updated_at on public.notifications;
create trigger trg_notifications_updated_at
  before update on public.notifications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 10. SUPPORT TICKETS + REPLIES (ticket timeline)
-- ---------------------------------------------------------------------
create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  subject text not null,
  description text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_support_tickets_owner_id on public.support_tickets(owner_id);

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

create table if not exists public.support_ticket_replies (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade, -- sender of this reply
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  message text not null,
  is_staff_reply boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ticket_replies_ticket_id on public.support_ticket_replies(ticket_id);

drop trigger if exists trg_ticket_replies_updated_at on public.support_ticket_replies;
create trigger trg_ticket_replies_updated_at
  before update on public.support_ticket_replies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 11. PAYMENTS / INVOICES
-- ---------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text not null,
  amount numeric(12, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'refunded')),
  due_date date,
  paid_at timestamptz,
  invoice_pdf_path text, -- path inside 'documents' or dedicated 'invoices' storage bucket
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_owner_id on public.payments(owner_id);

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 12. ACTIVITY LOGS (recent activity timeline on the dashboard)
-- ---------------------------------------------------------------------
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  action text not null, -- e.g. 'project_created', 'task_completed', 'document_uploaded'
  entity_type text,      -- 'project' | 'task' | 'document' | 'meeting' | 'support_ticket' | 'payment'
  entity_id uuid,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_owner_id on public.activity_logs(owner_id, created_at desc);

drop trigger if exists trg_activity_logs_updated_at on public.activity_logs;
create trigger trg_activity_logs_updated_at
  before update on public.activity_logs
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Every client only ever sees rows where owner_id = auth.uid().
-- Services table is readable by all authenticated users (it's a
-- shared catalog), writable only via service_role (admin/back office).
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.meetings enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_replies enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;

-- ---- PROFILES ----
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Note: INSERT is handled by the handle_new_user() trigger (security definer),
-- so clients never need direct insert access to profiles.

-- ---- SERVICES (read-only shared catalog) ----
drop policy if exists "services_select_all" on public.services;
create policy "services_select_all" on public.services
  for select using (auth.role() = 'authenticated');

-- ---- PROJECTS ----
drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own" on public.projects
  for select using (auth.uid() = owner_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own" on public.projects
  for insert with check (auth.uid() = owner_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own" on public.projects
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own" on public.projects
  for delete using (auth.uid() = owner_id);

-- ---- PROJECT UPDATES ----
drop policy if exists "project_updates_select_own" on public.project_updates;
create policy "project_updates_select_own" on public.project_updates
  for select using (auth.uid() = owner_id);

drop policy if exists "project_updates_insert_own" on public.project_updates;
create policy "project_updates_insert_own" on public.project_updates
  for insert with check (auth.uid() = owner_id);

drop policy if exists "project_updates_update_own" on public.project_updates;
create policy "project_updates_update_own" on public.project_updates
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "project_updates_delete_own" on public.project_updates;
create policy "project_updates_delete_own" on public.project_updates
  for delete using (auth.uid() = owner_id);

-- ---- TASKS ----
drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = owner_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = owner_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = owner_id);

-- ---- DOCUMENTS ----
drop policy if exists "documents_select_own" on public.documents;
create policy "documents_select_own" on public.documents
  for select using (auth.uid() = owner_id);

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own" on public.documents
  for insert with check (auth.uid() = owner_id);

drop policy if exists "documents_update_own" on public.documents;
create policy "documents_update_own" on public.documents
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "documents_delete_own" on public.documents;
create policy "documents_delete_own" on public.documents
  for delete using (auth.uid() = owner_id);

-- ---- MEETINGS ----
drop policy if exists "meetings_select_own" on public.meetings;
create policy "meetings_select_own" on public.meetings
  for select using (auth.uid() = owner_id);

drop policy if exists "meetings_insert_own" on public.meetings;
create policy "meetings_insert_own" on public.meetings
  for insert with check (auth.uid() = owner_id);

drop policy if exists "meetings_update_own" on public.meetings;
create policy "meetings_update_own" on public.meetings
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "meetings_delete_own" on public.meetings;
create policy "meetings_delete_own" on public.meetings
  for delete using (auth.uid() = owner_id);

-- ---- NOTIFICATIONS ----
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = owner_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete using (auth.uid() = owner_id);

-- Note: INSERT on notifications is done by backend triggers/functions
-- (security definer) when events happen, e.g. a new document is uploaded.

-- ---- SUPPORT TICKETS ----
drop policy if exists "support_tickets_select_own" on public.support_tickets;
create policy "support_tickets_select_own" on public.support_tickets
  for select using (auth.uid() = owner_id);

drop policy if exists "support_tickets_insert_own" on public.support_tickets;
create policy "support_tickets_insert_own" on public.support_tickets
  for insert with check (auth.uid() = owner_id);

drop policy if exists "support_tickets_update_own" on public.support_tickets;
create policy "support_tickets_update_own" on public.support_tickets
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ---- SUPPORT TICKET REPLIES ----
-- A client can see replies on tickets they own (join through support_tickets)
drop policy if exists "ticket_replies_select_own" on public.support_ticket_replies;
create policy "ticket_replies_select_own" on public.support_ticket_replies
  for select using (
    exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id and t.owner_id = auth.uid()
    )
  );

drop policy if exists "ticket_replies_insert_own" on public.support_ticket_replies;
create policy "ticket_replies_insert_own" on public.support_ticket_replies
  for insert with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id and t.owner_id = auth.uid()
    )
  );

-- ---- PAYMENTS (read-only for clients — created by admin/back office) ----
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments
  for select using (auth.uid() = owner_id);

drop policy if exists "payments_insert_backoffice" on public.payments;
create policy "payments_insert_backoffice" on public.payments
  for insert with check (auth.uid() = owner_id);

-- ---- ACTIVITY LOGS (read/write for clients and backend) ----
drop policy if exists "activity_logs_select_own" on public.activity_logs;
create policy "activity_logs_select_own" on public.activity_logs
  for select using (auth.uid() = owner_id);

drop policy if exists "activity_logs_insert_own" on public.activity_logs;
create policy "activity_logs_insert_own" on public.activity_logs
  for insert with check (auth.uid() = owner_id);

-- ---- NOTIFICATIONS (read/write for clients and backend) ----
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications
  for select using (auth.uid() = owner_id);

drop policy if exists "notifications_insert_own" on public.notifications;
create policy "notifications_insert_own" on public.notifications
  for insert with check (auth.uid() = owner_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own" on public.notifications
  for delete using (auth.uid() = owner_id);

-- =====================================================================
-- END OF MODULE 2
-- Next: run the Storage bucket setup (Documents module) and
-- Authentication flow (Module 3) which will use these tables.
-- =====================================================================
