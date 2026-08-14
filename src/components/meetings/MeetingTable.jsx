import { Link } from "react-router-dom";
import { ExternalLink, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MEETING_STATUS_LABELS } from "@/features/meetings/schemas";
import { formatDateTime } from "@/lib/utils";

export default function MeetingTable({ meetings, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.id}>
              <TableCell className="max-w-[220px] truncate font-medium">{meeting.title}</TableCell>
              <TableCell className="max-w-[180px] truncate">{meeting.project?.name || "-"}</TableCell>
              <TableCell className="whitespace-nowrap">{formatDateTime(meeting.scheduled_at)}</TableCell>
              <TableCell className="whitespace-nowrap">{meeting.duration_minutes} min</TableCell>
              <TableCell>{MEETING_STATUS_LABELS[meeting.status] || "Upcoming"}</TableCell>
              <TableCell>
                {meeting.meeting_link ? (
                  <a className="inline-flex items-center gap-1 text-primary hover:underline" href={meeting.meeting_link} target="_blank" rel="noreferrer">
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/dashboard/meetings/${meeting.id}`}><Eye className="h-4 w-4" /></Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit?.(meeting)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete?.(meeting)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
