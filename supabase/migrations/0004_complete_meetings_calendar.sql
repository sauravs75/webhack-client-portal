-- =====================================================================
-- Module 8: Meetings & Calendar notification compatibility
-- =====================================================================

create index if not exists idx_meetings_owner_status_scheduled
  on public.meetings(owner_id, status, scheduled_at);

alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (
    type in (
      'project_update',
      'meeting_reminder',
      'meeting_scheduled',
      'meeting_updated',
      'meeting_cancelled',
      'document_uploaded',
      'document_deleted',
      'support_reply',
      'general'
    )
  );

