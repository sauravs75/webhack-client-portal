import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectFormSchema } from "@/features/projects/schemas";
import { useServices } from "@/hooks/useProjects";

export default function ProjectForm({ project, onSubmit, onCancel, submitLabel = "Save project" }) {
  const { data: services = [] } = useServices();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "active",
      progress: project?.progress ?? 0,
      deadline: project?.deadline || "",
      service_id: project?.service_id || "",
      assigned_team: (project?.assigned_team || []).map((member) => member.name).join(", "),
    },
  });

  useEffect(() => {
    reset({
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "active",
      progress: project?.progress ?? 0,
      deadline: project?.deadline || "",
      service_id: project?.service_id || "",
      assigned_team: (project?.assigned_team || []).map((member) => member.name).join(", "),
    });
  }, [project, reset]);

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle>{project ? "Edit project" : "Create project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex min-h-[96px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select id="status" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("status")}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input id="progress" type="number" min="0" max="100" {...register("progress")} />
              {errors.progress && <p className="text-xs text-destructive">{errors.progress.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" {...register("deadline")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_id">Service type</Label>
              <select id="service_id" className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" {...register("service_id")}>
                <option value="">Select service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="assigned_team">Assigned team</Label>
              <Input id="assigned_team" placeholder="Jane, John, Alex" {...register("assigned_team")} />
              <p className="text-xs text-muted-foreground">Enter names separated by commas.</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
