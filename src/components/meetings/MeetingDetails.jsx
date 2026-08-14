import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MEETING_STATUS_LABELS } from "@/features/meetings/schemas";
import { formatDateTime } from "@/lib/utils";

export default function MeetingDetails({ meeting }) {
  if (!meeting) return null;

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Status</p>
          <p className="mt-1 font-medium">{MEETING_STATUS_LABELS[meeting.status] || "Upcoming"}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Related Project</p>
          <p className="mt-1 font-medium">{meeting.project?.name || "No linked project"}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="mt-1 font-medium">{formatDateTime(meeting.scheduled_at)}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="mt-1 font-medium">{meeting.duration_minutes} minutes</p>
        </div>
        {meeting.meeting_link ? (
          <Button asChild className="w-full">
            <a href={meeting.meeting_link} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open meeting link
            </a>
          </Button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/80 p-5">
        <p className="text-sm font-medium">Notes</p>
        <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{meeting.notes || "No notes added."}</p>
      </div>
    </div>
  );
}

