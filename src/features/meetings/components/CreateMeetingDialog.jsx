import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEETING_STATUS_LABELS, meetingSchema } from "@/features/meetings/schemas";
import { useCreateMeeting } from "@/hooks/useMeetings";
import { useProjects } from "@/hooks/useProjects";

export default function CreateMeetingDialog({ open, onOpenChange }) {
  const createMeeting = useCreateMeeting();
  const { data: projects = [] } = useProjects();
  const [error, setError] = useState("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: { title: "", project_id: "", scheduled_at: "", duration_minutes: 30, meeting_link: "", notes: "", status: "upcoming" },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    setError("");
    onOpenChange(false);
  };

  const onSubmit = async (values) => {
    setError("");
    try {
      await createMeeting.mutateAsync(values);
      handleClose();
    } catch (err) {
      setError(err?.message || "Unable to create meeting.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-2xl">
          <div className="rounded-2xl border border-border/70 bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Create meeting</h3>
                <p className="mt-1 text-sm text-muted-foreground">Schedule a client or project meeting.</p>
              </div>
              <Button variant="ghost" onClick={handleClose}>Close</Button>
            </div>
            {error ? <Alert variant="destructive" className="mb-4">{error}</Alert> : null}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="project_id">Related Project</Label>
                  <select id="project_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("project_id")}>
                    <option value="">No project</option>
                    {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
                    {Object.entries(MEETING_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Date and Time</Label>
                  <Input id="scheduled_at" type="datetime-local" {...register("scheduled_at")} />
                  {errors.scheduled_at ? <p className="text-xs text-destructive">{errors.scheduled_at.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration</Label>
                  <Input id="duration_minutes" type="number" min="5" step="5" {...register("duration_minutes")} />
                  {errors.duration_minutes ? <p className="text-xs text-destructive">{errors.duration_minutes.message}</p> : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_link">Meeting Link</Label>
                <Input id="meeting_link" placeholder="https://..." {...register("meeting_link")} />
                {errors.meeting_link ? <p className="text-xs text-destructive">{errors.meeting_link.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea id="notes" rows="4" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("notes")} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit" isLoading={isSubmitting || createMeeting.isPending}>Create meeting</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

