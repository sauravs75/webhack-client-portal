import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarClock, CheckCircle2, Clock3, FolderKanban, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardActivity, useDashboardStats, useUpcomingMeetings } from "@/hooks/useDashboard";
import { useTasks } from "@/hooks/useTasks";
import { formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const { data: dashboardStats } = useDashboardStats();
  const { data: activityFeed = [] } = useDashboardActivity();
  const { data: upcomingMeetings = [] } = useUpcomingMeetings();
  const { data: taskData } = useTasks({ limit: 3, sortBy: "deadline_asc" });
  const focusTasks = taskData?.data ?? [];
  const stats = [
    { label: "Active projects", value: dashboardStats?.projectCount ?? "-", detail: "Projects in your workspace" },
    { label: "Open tasks", value: dashboardStats?.openTaskCount ?? "-", detail: "Tasks not marked done" },
    { label: "Documents", value: dashboardStats?.documentCount ?? "-", detail: "Uploaded project files" },
    { label: "Upcoming meetings", value: dashboardStats?.upcomingMeetingCount ?? "-", detail: "Scheduled calls ahead" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Sprint overview</p>
          <h2 className="mt-1 text-2xl font-semibold">Your client portal is moving fast.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep stakeholders aligned with projects, tasks, documents, and updates all in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/meetings">
            View meetings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/70 bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's focus</CardTitle>
                <CardDescription>Priority items that deserve your attention.</CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusTasks.length === 0 ? (
              <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-sm font-medium">No open focus tasks</p>
                <p className="mt-1 text-xs text-muted-foreground">Priority work will appear here as tasks are added.</p>
              </div>
            ) : null}
            {focusTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.projects?.name || "No project"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {task.deadline ? formatDateTime(task.deadline) : "No deadline"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>What changed across your workspace.</CardDescription>
              </div>
              <div className="rounded-full bg-secondary p-2 text-secondary-foreground">
                <FolderKanban className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityFeed.length === 0 ? (
              <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-sm font-medium">No activity yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Workspace updates will appear here.</p>
              </div>
            ) : null}
            {activityFeed.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-sm font-medium">{activity.description || activity.action}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(activity.created_at)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming meetings</CardTitle>
              <CardDescription>Your next scheduled client and project conversations.</CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <CalendarClock className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingMeetings.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
              <p className="text-sm font-medium">No upcoming meetings</p>
              <p className="mt-1 text-xs text-muted-foreground">Scheduled meetings will appear here.</p>
            </div>
          ) : null}
          {upcomingMeetings.map((meeting) => (
            <Link key={meeting.id} to={`/dashboard/meetings/${meeting.id}`} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3 transition-colors hover:bg-accent">
              <div>
                <p className="text-sm font-medium">{meeting.title}</p>
                <p className="text-xs text-muted-foreground">{meeting.project?.name || "No project"}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                {formatDateTime(meeting.scheduled_at)}
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
