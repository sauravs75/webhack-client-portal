import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock3, FolderKanban, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active projects", value: "4", detail: "2 due this week" },
  { label: "Open tasks", value: "12", detail: "4 high priority" },
  { label: "Completed", value: "28", detail: "+6 since last week" },
];

const focusTasks = [
  { title: "Design review with client", time: "09:30" },
  { title: "Approve final content draft", time: "13:00" },
  { title: "Ship onboarding updates", time: "16:30" },
];

const activityFeed = [
  { label: "Project kickoff completed", meta: "Portal redesign · 2h ago" },
  { label: "Two tasks moved to done", meta: "Operations board · 4h ago" },
  { label: "New feedback added", meta: "Marketing assets · Yesterday" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Sprint overview</p>
          <h2 className="mt-1 text-2xl font-semibold">Your client portal is moving fast.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Keep stakeholders aligned with projects, tasks, and updates all in one place.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/projects">
            View projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle>Today’s focus</CardTitle>
                <CardDescription>Priority items that deserve your attention.</CardDescription>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {focusTasks.map((task) => (
              <div key={task.title} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Planned for today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {task.time}
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
            {activityFeed.map((activity) => (
              <div key={activity.label} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <p className="text-sm font-medium">{activity.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.meta}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
