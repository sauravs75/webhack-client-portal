import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MeetingCalendar from "@/components/meetings/MeetingCalendar";
import MeetingCard from "@/components/meetings/MeetingCard";
import MeetingEmptyState from "@/components/meetings/MeetingEmptyState";
import MeetingFilters from "@/components/meetings/MeetingFilters";
import MeetingSearch from "@/components/meetings/MeetingSearch";
import MeetingSkeleton from "@/components/meetings/MeetingSkeleton";
import MeetingTable from "@/components/meetings/MeetingTable";
import CreateMeetingDialog from "@/features/meetings/components/CreateMeetingDialog";
import EditMeetingDialog from "@/features/meetings/components/EditMeetingDialog";
import { useDeleteMeeting, useMeetings } from "@/hooks/useMeetings";

const PAGE_SIZE = 10;

export default function MeetingsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "all", projectId: "all", sortBy: "date_asc", view: "month", page: 1, limit: PAGE_SIZE });
  const { data, isLoading, error } = useMeetings(filters);
  const deleteMeeting = useDeleteMeeting();

  const meetings = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const updateFilters = (nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }));

  const handleDelete = async (meeting) => {
    const confirmed = window.confirm(`Delete "${meeting.title}"?`);
    if (!confirmed) return;
    await deleteMeeting.mutateAsync(meeting.id);
  };

  if (isLoading) return <MeetingSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p className="font-medium">Failed loading meetings.</p>
        <p className="mt-1">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary">Meetings</p>
          <h2 className="mt-1 text-2xl font-semibold leading-tight">Meetings & calendar</h2>
          <p className="mt-2 text-sm text-muted-foreground">Schedule, track, and review project meetings.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => setIsCreateOpen(true)}>
          <CalendarPlus className="h-4 w-4" />
          Create meeting
        </Button>
      </motion.div>

      <div className="grid gap-3 xl:grid-cols-[minmax(220px,320px)_1fr] xl:items-center">
        <MeetingSearch value={filters.search} onChange={(search) => updateFilters({ search, page: 1 })} />
        <MeetingFilters status={filters.status} projectId={filters.projectId} sortBy={filters.sortBy} view={filters.view} onChange={updateFilters} />
      </div>

      <MeetingCalendar meetings={meetings} view={filters.view} />

      {meetings.length === 0 ? (
        <MeetingEmptyState onAction={() => setIsCreateOpen(true)} />
      ) : (
        <>
          <div className="hidden lg:block">
            <MeetingTable meetings={meetings} onEdit={setEditMeeting} onDelete={handleDelete} />
          </div>
          <div className="grid gap-4 lg:hidden">
            {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} onEdit={setEditMeeting} onDelete={handleDelete} />)}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Showing {meetings.length} of {total} meetings</p>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <Button className="min-w-20" variant="outline" size="sm" disabled={filters.page <= 1} onClick={() => updateFilters({ page: Math.max(filters.page - 1, 1) })}>Previous</Button>
              <span className="shrink-0 text-sm text-muted-foreground">Page {filters.page} of {totalPages}</span>
              <Button className="min-w-20" variant="outline" size="sm" disabled={filters.page >= totalPages} onClick={() => updateFilters({ page: Math.min(filters.page + 1, totalPages) })}>Next</Button>
            </div>
          </div>
        </>
      )}

      <CreateMeetingDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditMeetingDialog open={Boolean(editMeeting)} onOpenChange={() => setEditMeeting(null)} meeting={editMeeting} />
    </div>
  );
}
