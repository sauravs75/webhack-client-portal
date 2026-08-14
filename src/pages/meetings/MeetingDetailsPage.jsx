import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MeetingDetails from "@/components/meetings/MeetingDetails";
import MeetingSkeleton from "@/components/meetings/MeetingSkeleton";
import EditMeetingDialog from "@/features/meetings/components/EditMeetingDialog";
import { useDeleteMeeting, useMeeting } from "@/hooks/useMeetings";

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: meeting, isLoading, error } = useMeeting(id);
  const deleteMeeting = useDeleteMeeting();

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${meeting.title}"?`);
    if (!confirmed) return;
    await deleteMeeting.mutateAsync(meeting.id);
    navigate("/dashboard/meetings");
  };

  if (isLoading) return <MeetingSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <p className="font-medium">Failed loading meeting.</p>
        <p className="mt-1">{error?.message || "Unknown error"}</p>
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3">
            <Link to="/dashboard/meetings">
              <ArrowLeft className="h-4 w-4" />
              Back to meetings
            </Link>
          </Button>
          <p className="text-sm font-medium text-primary">Meeting details</p>
          <h2 className="mt-1 break-words text-2xl font-semibold">{meeting.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{meeting.project?.name || "No linked project"}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete} isLoading={deleteMeeting.isPending}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <MeetingDetails meeting={meeting} />
      <EditMeetingDialog open={isEditOpen} onOpenChange={setIsEditOpen} meeting={meeting} />
    </div>
  );
}

