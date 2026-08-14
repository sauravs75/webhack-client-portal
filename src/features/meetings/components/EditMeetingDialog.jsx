import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEETING_STATUS_LABELS, meetingSchema } from "@/features/meetings/schemas";
import { useUpdateMeeting } from "@/hooks/useMeetings";
import { useProjects } from "@/hooks/useProjects";

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

export default function EditMeetingDialog({ open, onOpenChange, meeting }) {
  const updateMeeting = useUpdateMeeting();
  const { data: projects = [] } = useProjects();
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: { title: "", project_id: "", scheduled_at: "", duration_minutes: 30, meeting_link: "", notes: "", status: "upcoming" },
  });

  useEffect(() => {
    reset({
      title: meeting?.title || "",
      project_id: meeting?.project_id || "",
      scheduled_at: toDateTimeLocal(meeting?.scheduled_at),
      duration_minutes: meeting?.duration_minutes || 30,
      meeting_link: meeting?.meeting_link || "",
      notes: meeting?.notes || "",
      status: meeting?.status || "upcoming",
    });
  }, [meeting, reset]);

  if (!open || !meeting) return null;

  const handleClose = () => {
    setError("");
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    setError("");
    try {
      await updateMeeting.mutateAsync({ meetingId: meeting.id, values });
      handleClose();
    } catch (err) {
      setError(err?.message || "Unable to update meeting.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-2xl">
          <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Edit meeting</h3>
                <p className="mt-1 text-sm text-muted-foreground">Update meeting details and status.</p>
              </div>
              <Button variant="ghost" onClick={handleClose}>Close</Button>
            </div>
            {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="edit_title">Title</Label>
                <Input id="edit_title" {...register("title")} />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit_project_id">Related Project</Label>
                  <select id="edit_project_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("project_id")}>
                    <option value="">No project</option>
                    {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_status">Status</Label>
                  <select id="edit_status" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
                    {Object.entries(MEETING_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit_scheduled_at">Date and Time</Label>
                  <Input id="edit_scheduled_at" type="datetime-local" {...register("scheduled_at")} />
                  {errors.scheduled_at ? <p className="text-xs text-destructive">{errors.scheduled_at.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_duration_minutes">Duration</Label>
                  <Input id="edit_duration_minutes" type="number" min="5" step="5" {...register("duration_minutes")} />
                  {errors.duration_minutes ? <p className="text-xs text-destructive">{errors.duration_minutes.message}</p> : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_meeting_link">Meeting Link</Label>
                <Input id="edit_meeting_link" placeholder="https://..." {...register("meeting_link")} />
                {errors.meeting_link ? <p className="text-xs text-destructive">{errors.meeting_link.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_notes">Notes</Label>
                <textarea id="edit_notes" rows="4" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("notes")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting || updateMeeting.isPending}>Save changes</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

