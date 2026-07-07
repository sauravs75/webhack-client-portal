import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban } from "lucide-react";

const projects = [
  { name: "Portal redesign", owner: "Alicia", progress: 72, due: "Jul 18", status: "In progress" },
  { name: "Client onboarding", owner: "Marcus", progress: 46, due: "Jul 24", status: "Planning" },
  { name: "Release checklist", owner: "Nina", progress: 91, due: "Jul 10", status: "Near complete" },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Projects</p>
          <h2 className="mt-1 text-2xl font-semibold">Track every active engagement.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Keep delivery moving with a clear view of deadlines and progress.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Create project
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.name} className="border-border/70 bg-card/80">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>Owner: {project.owner}</CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <FolderKanban className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{project.status}</span>
                <span>Due {project.due}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
