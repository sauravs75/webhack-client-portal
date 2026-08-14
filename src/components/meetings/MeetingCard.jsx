import { Link } from "react-router-dom";
import { CalendarClock, ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEETING_STATUS_LABELS } from "@/features/meetings/schemas";
import { formatDateTime } from "@/lib/utils";

export default function MeetingCard({ meeting, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{meeting.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{meeting.project?.name || "No project"}</p>
        </div>
        <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {MEETING_STATUS_LABELS[meeting.status] || "Upcoming"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="font-medium">{formatDateTime(meeting.scheduled_at)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-medium">{meeting.duration_minutes} minutes</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {meeting.meeting_link ? (
          <Button asChild size="sm" variant="outline">
            <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Join
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm" variant="outline">
          <Link to={`/dashboard/meetings/${meeting.id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit?.(meeting)}>
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete?.(meeting)}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

