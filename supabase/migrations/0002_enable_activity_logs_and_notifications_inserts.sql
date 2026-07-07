-- Add explicit insert policies for activity logs and notifications

alter table public.activity_logs enable row level security;

drop policy if exists "activity_logs_insert_own" on public.activity_logs;
create policy "activity_logs_insert_own" on public.activity_logs
  for insert with check (auth.uid() = owner_id);

alter table public.notifications enable row level security;

drop policy if exists "notifications_insert_own" on public.notifications;
create policy "notifications_insert_own" on public.notifications
  for insert with check (auth.uid() = owner_id);
