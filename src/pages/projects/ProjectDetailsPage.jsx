import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, FileText, MessagesSquare, ReceiptText, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import ProjectProgressBar from "@/components/projects/ProjectProgressBar";
import ProjectMembers from "@/components/projects/ProjectMembers";
import ProjectTimeline from "@/components/projects/ProjectTimeline";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { data: project, isLoading, isError, error } = useProject(id);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading project details…</div>;
  }

  if (isError || !project) {
    return <div className="text-sm text-destructive">{error?.message || "Project not found."}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm">
        <div>
          <Button asChild variant="ghost" className="px-0">
            <Link to="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>
          <h2 className="mt-3 text-2xl font-semibold">{project.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{project.description || "This project is being tracked in the client portal."}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Project snapshot</CardTitle>
              <CardDescription>Core delivery details and progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ProjectProgressBar progress={project.progress} />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="mt-1 font-medium">{project.deadline ? formatDate(project.deadline) : "No deadline"}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                  <p className="text-sm text-muted-foreground">Service type</p>
                  <p className="mt-1 font-medium">{project.services?.name || "Unspecified"}</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background/60 p-3">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="mt-1 font-medium">{formatDateTime(project.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Assigned members</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectMembers members={project.assigned_team || []} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Related tasks</CardTitle>
              <CardDescription>Project-specific task activity.</CardDescription>
            </CardHeader>
            <CardContent>
              {project.tasks?.length ? (
                <div className="space-y-2">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="rounded-xl border border-border/70 bg-background/60 p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{task.title}</span>
                        <span className="text-muted-foreground">{task.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tasks linked to this project yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Recent updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ProjectTimeline items={project.project_updates || []} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80">
            <CardHeader>
              <CardTitle>Project insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Uploaded documents</p>
                  <p className="text-sm text-muted-foreground">{project.documents?.length || 0} files</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                <MessagesSquare className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Upcoming meetings</p>
                  <p className="text-sm text-muted-foreground">{project.meetings?.length || 0} scheduled</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                <ReceiptText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Payments</p>
                  <p className="text-sm text-muted-foreground">{project.payments?.length || 0} records</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(project.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
