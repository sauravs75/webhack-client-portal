import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle } from "lucide-react";

const tasks = [
  { title: "Prepare stakeholder summary", priority: "High", status: "In review", done: false },
  { title: "Confirm launch date", priority: "Medium", status: "Planned", done: false },
  { title: "Update onboarding checklist", priority: "Low", status: "Done", done: true },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Tasks</p>
          <h2 className="mt-1 text-2xl font-semibold">Clear ownership for the week ahead.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Stay on top of delivery with quick task status snapshots.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </div>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle>Task board</CardTitle>
          <CardDescription>Everything you need for the current sprint.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.title} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {task.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.status}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Priority: {task.priority}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
